"""Объясняющее видео: угол между скрещивающимися прямыми AC и BD.

Рендерит кадры matplotlib и собирает их в MP4 через ffmpeg:
    python3 render.py            # -> skew-lines-90deg.mp4
"""
import os
import shutil
import subprocess
import sys
from multiprocessing import Pool

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Polygon as Poly2D
from mpl_toolkits.mplot3d.art3d import Poly3DCollection

FPS = 30
W, H = 1280, 720
DPI = 100
HERE = os.path.dirname(os.path.abspath(__file__))
FRAMES = os.path.join(HERE, "_frames")
OUT = os.path.join(HERE, "skew-lines-90deg.mp4")

BG = "#0f1724"
FG = "#e8edf5"
DIM = "#8a97ab"
BLUE = "#4ea8ff"    # AC
RED = "#ff6b6b"     # BD
GREEN = "#5ee38f"   # KL
YELLOW = "#ffd166"  # M, треугольник KML
VIOLET = "#c59bff"  # параллелограмм

plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "mathtext.fontset": "dejavusans",
    "text.color": FG,
})

# Тетраэдр: AC ⟂ BD, |AC| = 6, |BD| = 8  =>  |KL| = 5.
P = {
    "A": np.array([-3.0, 0.0, 0.0]),
    "C": np.array([3.0, 0.0, 0.0]),
    "B": np.array([0.6, -4.0, 4.2]),
    "D": np.array([0.6, 4.0, 4.2]),
}
P["K"] = (P["A"] + P["D"]) / 2
P["L"] = (P["B"] + P["C"]) / 2
P["M"] = (P["A"] + P["B"]) / 2
P["N"] = (P["C"] + P["D"]) / 2
assert abs(np.linalg.norm(P["K"] - P["L"]) - 5) < 1e-9
assert abs(np.linalg.norm(P["K"] - P["M"]) - 4) < 1e-9
assert abs(np.linalg.norm(P["M"] - P["L"]) - 3) < 1e-9

# ---------------------------------------------------------------- сценарий
# (длительность, заголовок, строки текста). Строки появляются по очереди.
SCENES = [
    (5, None, []),  # титул
    (9, "Условие", [
        r"Точки $A, B, C, D$ не лежат",
        r"в одной плоскости.",
        r"$AC = 6$ см,   $BD = 8$ см.",
        r"Расстояние между серединами",
        r"$AD$ и $BC$ равно $5$ см.",
        r"Найти угол между $AC$ и $BD$.",
    ]),
    (9, "Прямые скрещиваются", [
        r"$AC$ и $BD$ не пересекаются:",
        r"иначе все четыре точки лежали бы",
        r"в одной плоскости.",
        r"Угол между скрещивающимися",
        r"прямыми — угол между",
        r"пересекающимися прямыми,",
        r"им параллельными.",
    ]),
    (8, "Середины", [
        r"$K$ — середина $AD$,",
        r"$L$ — середина $BC$.",
        r"По условию $KL = 5$ см.",
        r"Возьмём ещё $M$ — середину $AB$.",
    ]),
    (9, r"Треугольник $ABD$", [
        r"$KM$ соединяет середины $AD$ и $AB$",
        r"— это средняя линия:",
        r"$KM \parallel BD$,",
        r"$KM = BD\,/\,2 = 8\,/\,2 = 4$ см.",
    ]),
    (9, r"Треугольник $ABC$", [
        r"$ML$ соединяет середины $AB$ и $BC$",
        r"— тоже средняя линия:",
        r"$ML \parallel AC$,",
        r"$ML = AC\,/\,2 = 6\,/\,2 = 3$ см.",
    ]),
    (8, "Переносим угол", [
        r"$KM \parallel BD$  и  $ML \parallel AC$.",
        r"Стороны соответственно",
        r"параллельны, значит",
        r"$\angle KML$ = углу между $AC$ и $BD$.",
    ]),
    (11, r"Треугольник $KML$", [
        r"Стороны: $3,\ 4,\ 5$ — египетский!",
        r"$3^2 + 4^2 = 9 + 16 = 25 = 5^2$",
        r"По обратной теореме Пифагора",
        r"$\angle KML = 90^\circ$.",
    ]),
    (6, "Ответ", []),
    (10, "Параллелограмм", [
        r"Середины всех четырёх сторон",
        r"$M, L, N, K$ образуют параллелограмм.",
        r"Его стороны $3$ и $4$, а $KL = 5$ —",
        r"диагональ: $3^2+4^2=5^2$.",
        r"Соседние стороны $\perp$, а они",
        r"параллельны $AC$ и $BD$.",
    ]),
    (5, "Конец", []),
]
STARTS = np.cumsum([0] + [s[0] for s in SCENES])
TOTAL = float(STARTS[-1])


def ease(x):
    x = min(max(x, 0.0), 1.0)
    return x * x * (3 - 2 * x)


def ramp(t, t0, dur=0.8):
    return ease((t - t0) / dur)


def scene_t(i):
    return float(STARTS[i])


# ---------------------------------------------------------------- рисование
def seg(ax, a, b, color, lw, alpha, grow=1.0, ls="-", z=5):
    if alpha <= 0.01 or grow <= 0.0:
        return
    pa, pb = P[a], P[a] + (P[b] - P[a]) * grow
    ax.plot(*zip(pa, pb), color=color, lw=lw, alpha=alpha, ls=ls,
            solid_capstyle="round", zorder=z)


def dot(ax, name, color, alpha, size=60, off=(0, 0, 0.35), fs=17):
    if alpha <= 0.01:
        return
    p = P[name]
    ax.scatter(*p, s=size, color=color, alpha=alpha, depthshade=False,
               edgecolors=BG, linewidths=1.2, zorder=10)
    ax.text(*(p + np.array(off)), name, color=color, alpha=alpha,
            fontsize=fs, fontweight="bold", ha="center", va="center", zorder=11)


def label_mid(ax, a, b, text, color, alpha, off=(0, 0, 0.35), fs=15, at=0.5):
    if alpha <= 0.01:
        return
    p = P[a] + (P[b] - P[a]) * at + np.array(off)
    ax.text(*p, text, color=color, alpha=alpha, fontsize=fs,
            fontweight="bold", ha="center", va="center", zorder=12,
            bbox=dict(boxstyle="round,pad=0.2", fc=BG, ec="none",
                      alpha=0.75 * alpha))


def face(ax, names, color, alpha):
    if alpha <= 0.01:
        return
    poly = Poly3DCollection([[P[n] for n in names]], facecolor=color,
                            edgecolor="none", alpha=alpha)
    ax.add_collection3d(poly)


def right_mark(ax, at, a, b, color, alpha, s=0.55):
    if alpha <= 0.01:
        return
    u = P[a] - P[at]
    v = P[b] - P[at]
    u, v = u / np.linalg.norm(u) * s, v / np.linalg.norm(v) * s
    pts = [P[at] + u, P[at] + u + v, P[at] + v]
    ax.plot(*zip(*pts), color=color, lw=2.2, alpha=alpha, zorder=9)


def draw_3d(ax, t):
    ax.set_facecolor(BG)
    ax.set_axis_off()
    s1, s2, s3, s4, s5, s6, s7, s8, s9, s10 = [scene_t(i) for i in range(1, 11)]

    # камера медленно облетает фигуру
    azim = -72 + 50 * (t / TOTAL) + 6 * np.sin(t / 7)
    # к сценам с углом KML камера поднимается: KML лежит в плоскости z = 2.1
    lift = ramp(t, s6 - 1.0, 3.0)
    elev = (20 + 6 * np.sin(t / 11)) * (1 - lift) + 62 * lift
    ax.view_init(elev=elev, azim=azim)
    r = 3.7
    ax.set_xlim(-r, r); ax.set_ylim(-r, r); ax.set_zlim(-r + 2.1, r + 2.1)
    ax.set_box_aspect((1, 1, 1))

    # грани-подсветки
    face(ax, "ABD", RED, 0.16 * ramp(t, s4) * (1 - ramp(t, s5 - 0.6)))
    face(ax, "ABC", BLUE, 0.16 * ramp(t, s5) * (1 - ramp(t, s6 - 0.6)))
    face(ax, "KML", YELLOW, 0.30 * ramp(t, s6 + 1.5) * (1 - ramp(t, s9)))
    face(ax, "MLNK", VIOLET, 0.22 * ramp(t, s9 + 0.5) * (1 - ramp(t, s10 + 2)))

    # каркас тетраэдра
    a_edges = ramp(t, 0.8, 1.2)
    for e in ["AB", "AD", "CB", "CD"]:
        seg(ax, e[0], e[1], DIM, 1.4, 0.7 * a_edges)

    # скрещивающиеся прямые
    seg(ax, "A", "C", BLUE, 4, ramp(t, s1 + 0.8), grow=ramp(t, s1 + 0.8, 1.2))
    seg(ax, "B", "D", RED, 4, ramp(t, s1 + 1.6), grow=ramp(t, s1 + 1.6, 1.2))
    label_mid(ax, "A", "C", "6", BLUE, ramp(t, s1 + 2.6), off=(0, 0, -0.45),
              at=0.78)
    label_mid(ax, "B", "D", "8", RED, ramp(t, s1 + 3.0), off=(0, 0, 0.45),
              at=0.78)

    # продолжение прямых (сцена «скрещиваются»)
    ext = ramp(t, s2 + 0.5, 1.5) * (1 - ramp(t, s3))
    if ext > 0.01:
        for a, b, c in (("A", "C", BLUE), ("B", "D", RED)):
            d = P[b] - P[a]
            p0, p1 = P[a] - 0.35 * d, P[b] + 0.35 * d
            ax.plot(*zip(p0, p1), color=c, lw=1.4, ls=(0, (4, 4)), alpha=0.8 * ext)

    for n in "ABCD":
        off = {"A": (-0.45, 0, 0), "C": (0.45, 0, 0),
               "B": (0, -0.3, 0.4), "D": (0, 0.3, 0.4)}[n]
        dot(ax, n, FG, a_edges, off=off)

    # середины K, L и отрезок KL
    dot(ax, "K", GREEN, ramp(t, s3 + 0.3), off=(-0.35, 0.2, 0.35))
    dot(ax, "L", GREEN, ramp(t, s3 + 1.0), off=(0.35, -0.2, 0.35))
    seg(ax, "K", "L", GREEN, 2.6, ramp(t, s3 + 2.0), grow=ramp(t, s3 + 2.0, 1.2),
        ls=(0, (5, 3)))
    label_mid(ax, "K", "L", "5", GREEN, ramp(t, s3 + 3.0), off=(0, 0, 0.4))
    dot(ax, "M", YELLOW, ramp(t, s3 + 4.5), off=(-0.3, -0.35, -0.35))

    # средние линии
    seg(ax, "K", "M", RED, 3.4, ramp(t, s4 + 2.0), grow=ramp(t, s4 + 2.0, 1.2))
    label_mid(ax, "K", "M", "4", RED, ramp(t, s4 + 4.0), off=(-0.4, 0, 0))
    seg(ax, "M", "L", BLUE, 3.4, ramp(t, s5 + 2.0), grow=ramp(t, s5 + 2.0, 1.2))
    label_mid(ax, "M", "L", "3", BLUE, ramp(t, s5 + 4.0), off=(0, -0.3, -0.35))

    # прямой угол при M
    right_mark(ax, "M", "K", "L", YELLOW, ramp(t, s7 + 6.0))

    # параллелограмм середин
    a_par = ramp(t, s9 + 0.5)
    dot(ax, "N", VIOLET, a_par, off=(0.35, 0.3, 0.35))
    seg(ax, "L", "N", VIOLET, 2.6, a_par, grow=ramp(t, s9 + 0.5, 1.2))
    seg(ax, "N", "K", VIOLET, 2.6, a_par, grow=ramp(t, s9 + 1.2, 1.2))


def draw_text_panel(fig, t):
    i = int(np.searchsorted(STARTS, t, side="right") - 1)
    i = min(i, len(SCENES) - 1)
    dur, title, lines = SCENES[i]
    lt = t - STARTS[i]
    fade_out = 1 - ramp(lt, dur - 0.5, 0.5) if i < len(SCENES) - 1 else 1.0
    x0 = 0.585

    # прогресс-бар и подпись
    fig.add_artist(plt.Rectangle((0, 0), 1, 0.008, color="#1e2a3b",
                                 transform=fig.transFigure))
    fig.add_artist(plt.Rectangle((0, 0), t / TOTAL, 0.008, color=YELLOW,
                                 transform=fig.transFigure))
    fig.text(0.985, 0.03, "Стереометрия · скрещивающиеся прямые",
             color=DIM, fontsize=10, ha="right")

    if i == 0:  # титул
        a = ramp(lt, 0.2) * fade_out
        fig.text(x0, 0.62, "Угол между", fontsize=34, color=FG, alpha=a,
                 fontweight="bold")
        fig.text(x0, 0.53, "скрещивающимися", fontsize=34, color=FG, alpha=a,
                 fontweight="bold")
        fig.text(x0, 0.44, "прямыми", fontsize=34, color=FG, alpha=a,
                 fontweight="bold")
        fig.text(x0, 0.33, r"$AC = 6,\ \ BD = 8,\ \ KL = 5$",
                 fontsize=22, color=YELLOW, alpha=ramp(lt, 1.2) * fade_out)
        return

    if title == "Ответ":
        a = ramp(lt, 0.2)
        fig.text(x0, 0.72, "Ответ", fontsize=26, color=DIM, alpha=a)
        fig.text(x0, 0.52, r"$\angle(AC,\ BD) = 90^\circ$", fontsize=40,
                 color=YELLOW, alpha=ramp(lt, 0.6) * fade_out)
        fig.text(x0, 0.40, "Прямые AC и BD перпендикулярны.",
                 fontsize=18, color=FG, alpha=ramp(lt, 1.5) * fade_out)
        return

    if title == "Конец":
        a = ramp(lt, 0.2)
        fig.text(x0, 0.60, "Главная идея", fontsize=26, color=YELLOW, alpha=a,
                 fontweight="bold")
        for k, s in enumerate([
            "Средние линии переносят",
            "скрещивающиеся прямые",
            "в один треугольник —",
            r"и задача сводится к $3^2+4^2=5^2$.",
        ]):
            fig.text(x0, 0.50 - 0.065 * k, s, fontsize=18, color=FG,
                     alpha=ramp(lt, 0.8 + 0.4 * k))
        return

    fig.text(x0, 0.86, title, fontsize=26, color=YELLOW, fontweight="bold",
             alpha=ramp(lt, 0.0, 0.5) * fade_out)
    step = min(1.0, (dur - 2.5) / max(len(lines), 1))
    y = 0.76
    for k, s in enumerate(lines):
        fig.text(x0, y, s, fontsize=18, color=FG,
                 alpha=ramp(lt, 0.5 + k * step, 0.6) * fade_out)
        y -= 0.068

    if title == r"Треугольник $KML$":
        draw_triangle_inset(fig, lt, fade_out)


def draw_triangle_inset(fig, lt, fade_out):
    """Плоский чертёж египетского треугольника справа внизу."""
    a = ramp(lt, 1.0) * fade_out
    if a <= 0.01:
        return
    ax = fig.add_axes([0.62, 0.05, 0.30, 0.36])
    ax.set_facecolor(BG)
    ax.set_axis_off()
    ax.set_aspect("equal")
    M, L, K = np.array([0, 0]), np.array([3, 0]), np.array([0, 4])
    ax.add_patch(Poly2D([M, L, K], closed=True, fc=YELLOW, alpha=0.18 * a,
                        ec="none"))
    ax.plot(*zip(M, K), color=RED, lw=3, alpha=a)
    ax.plot(*zip(M, L), color=BLUE, lw=3, alpha=a)
    ax.plot(*zip(K, L), color=GREEN, lw=3, alpha=a, ls=(0, (5, 3)))
    ra = ramp(lt, 6.0)
    ax.plot([0.4, 0.4, 0], [0, 0.4, 0.4], color=YELLOW, lw=2, alpha=ra * a)
    ax.text(0.85, 0.75, r"$90^\circ$", color=YELLOW, fontsize=15, alpha=ra * a)
    ax.text(-0.25, 2, "4", color=RED, fontsize=16, ha="right", va="center",
            alpha=a, fontweight="bold")
    ax.text(1.5, -0.3, "3", color=BLUE, fontsize=16, ha="center", va="top",
            alpha=a, fontweight="bold")
    ax.text(1.75, 2.2, "5", color=GREEN, fontsize=16, alpha=a, fontweight="bold")
    for name, p, off in (("M", M, (-0.3, -0.3)), ("L", L, (0.3, -0.3)),
                         ("K", K, (-0.3, 0.2))):
        ax.text(p[0] + off[0], p[1] + off[1], name, color=FG, fontsize=14,
                ha="center", va="center", alpha=a, fontweight="bold")
    ax.set_xlim(-1.0, 4.0)
    ax.set_ylim(-0.9, 4.6)


def render(frame):
    t = frame / FPS
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI, facecolor=BG)
    ax = fig.add_axes([-0.06, -0.08, 0.68, 1.16], projection="3d")
    draw_3d(ax, t)
    draw_text_panel(fig, t)
    fig.savefig(os.path.join(FRAMES, f"{frame:05d}.png"), facecolor=BG)
    plt.close(fig)


def main():
    only = sys.argv[1:]  # отладка: python3 render.py 12.5 40 — отдельные кадры
    if os.path.isdir(FRAMES):
        shutil.rmtree(FRAMES)
    os.makedirs(FRAMES)
    if only:
        for s in only:
            render(int(float(s) * FPS))
        return
    n = int(TOTAL * FPS)
    with Pool() as pool:
        for k, _ in enumerate(pool.imap_unordered(render, range(n), chunksize=8)):
            if k % 300 == 0:
                print(f"{k}/{n}", flush=True)
    subprocess.run([
        "ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS),
        "-i", os.path.join(FRAMES, "%05d.png"),
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20",
        "-movflags", "+faststart", OUT,
    ], check=True)
    shutil.rmtree(FRAMES)
    print("ready:", OUT)


if __name__ == "__main__":
    main()
