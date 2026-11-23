#!/usr/bin/env python3
"""Build store-style promo frames from the app screenshots and screenshot them.

Sources live in scripts/store-promo/source/<app>/<locale>/*.jpg (copied once
from public/images before the posters replace them). Output overwrites
public/images/<app>/<locale>/*.jpg.

Run: python3 scripts/store-promo/render.py
"""

from __future__ import annotations

import html
import http.server
import shutil
import socketserver
import subprocess
import threading
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "public" / "images"
SOURCE = Path(__file__).resolve().parent / "source"
WORK = Path("/tmp/xiaowu-store-promo")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

W, H = 1080, 1920

# focus is object-position for the embedded screenshot.
SLIDES = {
    ("kogo", "zh"): [
        ("1.jpg", "KOGO", "沿地图<br>推进课程", "选一条教材路线，一课一课往前走", "top"),
        ("2.jpg", "KOGO", "四项技能<br>一起练", "词汇、语法、阅读、听力，进度都在一张卡上", "top"),
        ("3.jpg", "KOGO", "回到营地<br>再巩固", "错题、假名和收藏，复习从这里开始", "top"),
        ("4.jpg", "KOGO", "你的<br>冒险者档案", "当前目标、天梯分和四技能，一目了然", "top"),
        ("5.jpg", "KOGO", "五十音<br>点一下就能听", "清音、浊音、拗音，忘了就回来扫一眼", "top"),
        ("6.jpg", "KOGO", "天梯上见", "分段榜单，完成一课就来点亮名次", "top"),
        ("7.jpg", "KOGO", "从 N5<br>走到 N1", "通过晋级测验，再解锁下一档", "top"),
    ],
    ("kogo", "en"): [
        ("1.jpg", "KOGO", "Follow<br>the map", "Pick a course and move one lesson at a time", "top"),
        ("2.jpg", "KOGO", "Train every<br>skill", "Vocabulary, grammar, reading, and listening", "top"),
        ("3.jpg", "KOGO", "Back to<br>camp", "Mistakes, kana, and the cards you saved", "top"),
        ("4.jpg", "KOGO", "Your adventurer<br>card", "Goal, ladder score, and skill progress", "top"),
        ("5.jpg", "KOGO", "Climb the<br>ladder", "Ranked boards that light up as you finish lessons", "top"),
        ("6.jpg", "KOGO", "From N5<br>to N1", "Pass the promotion exam to unlock the next level", "top"),
        ("7.jpg", "KOGO", "One form<br>at a time", "Verb conjugation, drilled in short rounds", "top"),
    ],
    ("time_age", "zh"): [
        ("1.jpg", "TIME AGE", "值得记住<br>的日子", "还没有事件时，点一下就开始", "center"),
        ("2.jpg", "TIME AGE", "和在乎的人<br>一起倒数", "创建群组，或用邀请码加入", "top"),
        ("3.jpg", "TIME AGE", "把同伴<br>拉进群组", "邀请码、成员和共享事件都在这里", "top"),
        ("4.jpg", "TIME AGE", "倒数、累计<br>都在这里", "账户、提醒和云端同步", "top"),
        ("5.jpg", "TIME AGE", "精确到<br>小时", "倒数或累计，重复和提醒一次设好", "top"),
    ],
    ("time_age", "en"): [
        ("1.jpg", "TIME AGE", "Days worth<br>keeping", "Start with one countdown or milestone", "center"),
        ("2.jpg", "TIME AGE", "Count down<br>together", "Create a group, or join with a code", "top"),
        ("3.jpg", "TIME AGE", "Yours,<br>in sync", "Countdowns, milestones, and cloud sync", "top"),
        ("4.jpg", "TIME AGE", "Invite your<br>people", "A code, the members, and the events you share", "top"),
        ("5.jpg", "TIME AGE", "Down to<br>the hour", "Countdown or milestone, with repeat and reminders", "top"),
    ],
}

CSS = """
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1080px; height: 1920px; overflow: hidden; }
.frame {
  width: 1080px;
  height: 1920px;
  padding: 96px 72px 72px;
  display: flex;
  flex-direction: column;
}
.kicker {
  font-size: 22px;
  letter-spacing: 0.32em;
  font-weight: 600;
}
.rule {
  width: 56px;
  height: 3px;
  margin-top: 22px;
  border-radius: 2px;
}
h1 {
  margin-top: 28px;
  font-size: 84px;
  line-height: 1.08;
  font-weight: 650;
  letter-spacing: -0.02em;
}
.sub {
  margin-top: 22px;
  max-width: 820px;
  font-size: 30px;
  line-height: 1.45;
  font-weight: 400;
}
.shot {
  margin-top: 48px;
  flex: 1;
  min-height: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.shot img {
  height: 100%;
  width: auto;
  max-width: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  border-radius: 36px;
}
.kogo {
  background:
    radial-gradient(900px 520px at 100% -10%, rgba(31,31,29,0.06), transparent 60%),
    linear-gradient(180deg, #F7F5F0 0%, #EFECE3 100%);
  color: #1F1F1D;
  font-family: "Songti SC", "STSong", "Source Han Serif SC", serif;
}
.kogo .kicker, .kogo .sub {
  font-family: "PingFang SC", "Hiragino Sans GB", sans-serif;
  color: #6B6B66;
  font-weight: 500;
}
.kogo .rule { background: #1F1F1D; }
.kogo .shot img {
  box-shadow: 0 28px 70px rgba(31, 31, 29, 0.16);
}
.time {
  background:
    radial-gradient(820px 480px at 0% -8%, rgba(78, 205, 196, 0.28), transparent 58%),
    linear-gradient(180deg, #17171B 0%, #0C0C0E 70%);
  color: #F2F2F2;
  font-family: "PingFang SC", "SF Pro Display", "Hiragino Sans GB", sans-serif;
}
.time .kicker { color: #4ECDC4; }
.time .rule { background: #4ECDC4; }
.time .sub { color: #9A9A9A; }
.time .shot img {
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
}
.en h1 { font-size: 76px; letter-spacing: -0.03em; }
.en.kogo h1 { font-family: "Iowan Old Style", "Palatino", "Songti SC", serif; }
"""


def seed_sources() -> None:
    """Copy UI screenshots once. Later runs must not replace them with posters."""
    if any(SOURCE.rglob("*.jpg")):
        return
    for src in PUBLIC.rglob("*.jpg"):
        rel = src.relative_to(PUBLIC)
        dest = SOURCE / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest)


def page(app: str, locale: str, name: str, kicker: str, title: str, sub: str, focus: str) -> str:
    theme = "kogo" if app == "kogo" else "time"
    src = f"/source/{app}/{locale}/{name}"
    return f"""<!DOCTYPE html>
<html lang="{locale}">
<head>
<meta charset="utf-8">
<style>{CSS}</style>
</head>
<body>
  <section class="frame {theme} {locale}">
    <p class="kicker">{html.escape(kicker)}</p>
    <div class="rule"></div>
    <h1>{title}</h1>
    <p class="sub">{html.escape(sub)}</p>
    <div class="shot"><img src="{src}" alt="" style="object-position: {focus}"></div>
  </section>
</body>
</html>
"""


def serve(directory: Path) -> tuple[socketserver.TCPServer, int]:
    handler = lambda *args, **kwargs: http.server.SimpleHTTPRequestHandler(  # noqa: E731
        *args, directory=str(directory), **kwargs
    )
    httpd = socketserver.TCPServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    return httpd, httpd.server_address[1]


def shoot(url: str, png: Path) -> None:
    subprocess.run(
        [
            CHROME,
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            "--force-device-scale-factor=1",
            "--window-size=1080,1920",
            f"--screenshot={png}",
            url,
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def to_jpeg(png: Path, dest: Path) -> tuple[int, int]:
    im = Image.open(png).convert("RGB")
    if im.size != (W, H):
        im = im.crop((0, 0, min(im.width, W), min(im.height, H)))
        if im.size != (W, H):
            canvas = Image.new("RGB", (W, H), (0, 0, 0))
            canvas.paste(im, (0, 0))
            im = canvas
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "JPEG", quality=92, subsampling=0, optimize=True)
    return im.size


def main() -> None:
    seed_sources()
    frames = WORK / "frames"
    if frames.exists():
        shutil.rmtree(frames)
    frames.mkdir(parents=True)
    # Serve source + frames from one root.
    web = WORK / "web"
    if web.exists():
        shutil.rmtree(web)
    web.mkdir(parents=True)
    (web / "source").symlink_to(SOURCE)
    (web / "frames").mkdir()

    jobs: list[tuple[str, Path]] = []
    for (app, locale), slides in SLIDES.items():
        for name, kicker, title, sub, focus in slides:
            file_name = f"{app}-{locale}-{name.replace('.jpg', '')}.html"
            html_path = web / "frames" / file_name
            html_path.write_text(page(app, locale, name, kicker, title, sub, focus), encoding="utf-8")
            jobs.append((f"/frames/{file_name}", PUBLIC / app / locale / name))

    httpd, port = serve(web)
    try:
        for i, (url_path, dest) in enumerate(jobs, 1):
            png = WORK / f"{i}.png"
            shoot(f"http://127.0.0.1:{port}{url_path}", png)
            size = to_jpeg(png, dest)
            print(f"{dest.relative_to(ROOT)} {size}")
    finally:
        httpd.shutdown()


if __name__ == "__main__":
    main()
