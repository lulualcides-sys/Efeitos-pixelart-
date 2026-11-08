from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
from math import sin, cos, pi, sqrt
import random, hashlib, json
ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'assets'
OUT.mkdir(exist_ok=True, parents=True)
S = 96
MOVES = ['sacred-fire', 'aeroblast', 'octazooka', 'spider-web', 'venoshock', 'signal-beam']
COLORS = {'sacred-fire': ['#541a1d', '#a92f20', '#ed512b', '#ff9c30', '#ffd35c', '#fff3aa'], 'aeroblast': ['#214b65', '#326f91', '#62a8ca', '#a0dcdd', '#defff5', '#ffffff'], 'octazooka': ['#1e1c46', '#3c245e', '#602f7d', '#9747a1', '#18b5c4', '#b1f7f3'], 'spider-web': ['#363b56', '#777b96', '#aeb8cd', '#e7edee', '#ffffff', '#8cdae1'], 'venoshock': ['#381944', '#722a86', '#b13ac1', '#e86de0', '#bbff47', '#f7ffac'], 'signal-beam': ['#176652', '#289b65', '#8bd64c', '#f7cb54', '#ffeb9b', '#91e0dc']}

def poly(d, pts, fill):
    d.polygon([(round(x), round(y)) for x, y in pts], fill=fill)

def line(d, pts, fill, width=1):
    d.line([(round(x), round(y)) for x, y in pts], fill=fill, width=width, joint='curve')

def circ(d, x, y, r, color):
    d.ellipse((round(x - r), round(y - r), round(x + r), round(y + r)), fill=color)

def ring(d, x, y, r, col, w=2, ry=None):
    d.ellipse((round(x - r), round(y - (ry or r)), round(x + r), round(y + (ry or r))), outline=col, width=w)

def tiny(d, x, y, col):
    d.point((round(x), round(y)), fill=col)

def spark(d, x, y, r, c):
    line(d, [(x - r, y), (x + r, y)], c, 1)
    line(d, [(x, y - r), (x, y + r)], c, 1)

def jag(d, pts, outer, inner):
    line(d, pts, outer, 4)
    line(d, pts, inner, 2)

def flame(d, x, y, h, w, pal, lean=0):
    if h < 2:
        return
    y0 = y
    x0 = x
    poly(d, [(x - w, y), (x - w * 0.89, y - h * 0.32), (x - w * 0.57 + lean * 0.2, y - h * 0.57), (x - w * 0.28 + lean * 0.68, y - h * 0.56), (x + lean, y - h), (x + w * 0.19 + lean * 0.35, y - h * 0.57), (x + w * 0.66, y - h * 0.55), (x + w * 0.89, y - h * 0.22), (x + w, y)], pal[1])
    poly(d, [(x - w * 0.72, y), (x - w * 0.65, y - h * 0.25), (x - w * 0.23 + lean * 0.18, y - h * 0.43), (x + lean * 0.62, y - h * 0.67), (x + w * 0.34 + lean * 0.25, y - h * 0.36), (x + w * 0.67, y - h * 0.2), (x + w * 0.68, y)], pal[2])
    poly(d, [(x - w * 0.33, y), (x - w * 0.3, y - h * 0.2), (x + lean * 0.24, y - h * 0.5), (x + w * 0.24, y - h * 0.24), (x + w * 0.35, y)], pal[3])
    poly(d, [(x - w * 0.13, y), (x + lean * 0.15, y - h * 0.25), (x + w * 0.2, y)], pal[4])

def sacred(d, f, rng):
    p = COLORS['sacred-fire']
    if f < 3:
        lift = f / 2
        ring(d, 23, 66, 10 + f * 3, p[3], 2, ry=4)
        for dx, t in [(-8, 13), (0, 22), (8, 16)]:
            flame(d, 23 + dx, 65, max(3, t * lift), 5 + f, p, -3 + dx / 2)
        for j in range(4 + f * 2):
            spark(d, 15 + j * 9 % 28, 44 + j * 11 % 21, 1, p[4])
    elif f < 9:
        t = (f - 3) / 5
        x = 20 + 56 * t
        y = 49 - 9 * sin(t * pi)
        for i in range(4):
            xx = x - 7 - i * 10
            yy = y + (-1) ** i * (5 + i)
            flame(d, xx, yy + 8, 12 + i * 2, 3 + i % 3, p, lean=-9)
        poly(d, [(x - 13, y - 5), (x - 3, y - 10), (x + 8, y - 5), (x + 17, y), (x + 7, y + 6), (x - 7, y + 8)], p[2])
        poly(d, [(x - 7, y - 3), (x + 4, y - 6), (x + 16, y), (x + 2, y + 4)], p[4])
        for j in range(6):
            ex = x - 8 - j * 7
            ey = y + (-1) ** j * (3 + j * 2)
            if ex > 2:
                spark(d, ex, ey, 1 if j % 2 else 2, p[3])
    elif f < 13:
        a = [0.5, 0.94, 1.0, 0.72][f - 9]
        x = 71
        ring(d, x, 69, 25 * a, p[3], 2, ry=9 * a)
        for flip in (-1, 1):
            poly(d, [(x, 53), (x + flip * 9 * a, 39 * a + 53 * (1 - a)), (x + flip * 22 * a, 40), (x + flip * 31 * a, 27), (x + flip * 22 * a, 54), (x + flip * 12 * a, 58)], p[1])
            poly(d, [(x, 52), (x + flip * 11 * a, 42), (x + flip * 22 * a, 39), (x + flip * 15 * a, 54)], p[3])
            line(d, [(x + flip * 3 * a, 53), (x + flip * 21 * a, 43)], p[4], 1)
        for j in range(6):
            dx = -21 + j * 8
            height = round((29 + j * 7 % 16) * a)
            w = 4 + j % 3
            flame(d, x + dx, 72, height, w, p, lean=(-1) ** j * 8)
        for j in range(13):
            px = x - 27 + j * 13 % 55
            py = 70 - j * 9 % 42 * a
            if 2 < px < 95:
                spark(d, px, py, 1, p[3 if j % 2 else 4])
    else:
        a = (16 - f) / 4
        x = 72
        for j in range(6):
            xx = x - 27 + j * 10
            yy = 69 - j * 7 % 27 * a
            flame(d, xx, yy + 4, 12 * a, 3, p, lean=(-1) ** j * 3)
        for j in range(9):
            tiny(d, 45 + j * 17 % 49, 41 + j * 11 % 39, p[3])

def crescent(d, cx, cy, rx, ry, outer, inner, side=1):
    d.arc((round(cx - rx), round(cy - ry), round(cx + rx), round(cy + ry)), start=175, end=360, fill=outer, width=3)
    d.arc((round(cx - rx * 0.83), round(cy - ry * 0.72), round(cx + rx * 0.83), round(cy + ry * 0.72)), start=185, end=332, fill=inner, width=1)
    line(d, [(cx + rx * 0.3, cy - ry * 0.75), (cx + rx, cy)], inner, 1)

def aeroblast(d, f, rng):
    p = COLORS['aeroblast']
    x = 21 + min(1, max(0, (f - 3) / 5)) * 56
    y = 48
    if f < 3:
        for q in range(2 + f):
            rr = 6 + q * 4 + f * 2
            ring(d, 24, 48, rr, p[2 + q % 3], 1, ry=rr * 0.6)
        for j in range(4 + f):
            line(d, [(11 - j % 2 * 4, 36 + j * 4), (21 + f * 2, 35 + j * 4)], p[2], 1)
    elif f < 9:
        t = (f - 3) / 5
        for q in range(4):
            xx = x - 28 + q * 8
            rr = 7 + (q + f) % 3 * 3
            if xx < 0:
                continue
            ring(d, xx, y, rr, p[q % 3 + 2], 2, ry=rr * 0.67)
            line(d, [(xx - rr, y - rr * 0.6), (xx + rr, y + rr * 0.6)], p[4], 1)
        poly(d, [(x - 18, y - 4), (x + 12, y - 6), (x + 22, y), (x + 12, y + 6), (x - 18, y + 4)], p[2])
        poly(d, [(x - 15, y - 2), (x + 18, y), (x - 15, y + 2)], p[4])
        for j in range(6):
            off = (-1) ** j * (10 + j * 2)
            length = 10 + j * 4
            xx = x - 10 - j * 4
            line(d, [(xx - length, y + off), (xx, y + off * 0.56)], p[2 + j % 2], 2 if j < 3 else 1)
    elif f < 13:
        a = [0.46, 0.85, 1, 0.64][f - 9]
        x = 73
        for j in range(5):
            angle = j * pi / 2.5 + (f - 9) * 0.15
            rr = (10 + j * 4) * a
            pts = [(x + rr * cos(angle + u * 0.19), y + rr * sin(angle + u * 0.19) * 0.8) for u in range(8)]
            line(d, pts, p[j % 3 + 2], 2 if j < 3 else 1)
        for j in range(5):
            yy = 48 + (j - 2) * 10 * a
            line(d, [(x - 25 * a, yy - 7 * a), (x - 9 * a, yy), (x + 19 * a, yy - 4 * a)], p[3 if j % 2 else 4], 2)
        spark(d, x, 48, 9 * a, p[5])
        ring(d, x, 48, 15 * a, p[4], 2, ry=12 * a)
    else:
        a = (16 - f) / 3
        for j in range(7):
            xx = 42 + j * 13 % 49
            yy = 26 + j * 11 % 48
            line(d, [(xx - 10 * a, yy - 2 * a), (xx + 9 * a, yy + 3 * a)], p[2 + j % 3], 1)

def octazooka(d, f, rng):
    p = COLORS['octazooka']
    x = 20 + min(1, max(0, (f - 3) / 5)) * 55
    y = 47
    if f < 3:
        ring(d, 22, 48, 7 + f * 3, p[4], 2)
        for j in range(f + 1):
            circ(d, 18 + j * 5, 48 + j % 2 * 4, 3 + j, p[2])
        for j in range(3 + f):
            ring(d, 8 + j * 7, 33 + j * 17 % 24, 1 + j % 2, p[5], 1)
    elif f < 9:
        for j in range(5):
            bx = x - 5 - j % 3 * 5 + j // 3 * 6
            by = y + (j - 2) * 5 + 3 * sin(j + f)
            circ(d, bx + 1, by + 1, 7 + j % 3, p[0])
            circ(d, bx, by, 6 + j % 3, p[2])
            circ(d, bx - 2, by - 2, 2, p[3])
        crescent(d, x - 3, y, 17, 11, p[4], p[5], side=1)
        for j in range(7):
            px = x - 12 - j * 7
            py = y - 15 + j * 9 % 30
            if px > 1:
                if j % 2:
                    ring(d, px, py, 2 + j % 2, p[5], 1)
                else:
                    circ(d, px, py, 2, p[2])
    elif f < 13:
        a = [0.62, 1, 1, 0.73][f - 9]
        x = 70
        y = 53
        for j in range(8):
            ang = j / 8 * 2 * pi + (f - 9) * 0.18
            radius = (10 + j % 3 * 4) * a
            cx = x + cos(ang) * radius
            cy = y + sin(ang) * radius * 0.65
            circ(d, cx, cy, (7 + j % 3 * 2) * a, p[0])
            circ(d, cx - 1, cy - 1, (5 + j % 3 * 2) * a, p[2])
        circ(d, x, y, 12 * a, p[1])
        circ(d, x - 2, y - 2, 6 * a, p[3])
        for j in range(8):
            xx = x - 25 + j * 8 % 49
            yy = 71 - j * 13 % 22
            if j % 2:
                ring(d, xx, yy, 2 * a, p[5], 1)
            else:
                circ(d, xx, yy, 2 * a, p[4])
        for j in range(3):
            line(d, [(x - 23 + j * 19, y + 11 * a), (x - 25 + j * 22, 80)], p[2], 3)
    else:
        a = (16 - f) / 4
        for j in range(11):
            cx = 46 + j * 11 % 43
            cy = 58 + j * 17 % 23
            circ(d, cx, cy, 1 + 3 * a, p[2])
            if j % 3 == 0:
                ring(d, cx + 4, cy - 8, 1 + 2 * a, p[4], 1)

def spiderweb(d, f, rng):
    p = COLORS['spider-web']
    x = 20 + min(1, max(0, (f - 3) / 5)) * 55
    cy = 50
    if f < 3:
        circ(d, 22, 50, 3 + f * 2, p[2])
        circ(d, 20, 48, 1 + f, p[4])
        for j in range(3 + f):
            a = j * 2 * pi / (3 + f)
            line(d, [(22, 50), (22 + 10 * cos(a), 50 + 10 * sin(a))], p[3], 1)
    elif f < 9:
        a = (f - 3) / 5
        r = 4 + f * 1.2
        line(d, [(x - 18, cy - 17), (x + 7, cy - 4), (x + 15, cy)], p[2], 2)
        line(d, [(x - 18, cy + 17), (x + 7, cy + 4), (x + 15, cy)], p[3], 2)
        for j in range(6):
            theta = -0.75 + j * 0.3
            xx = x - 13
            line(d, [(x + 13, cy), (xx - 14, cy + theta * 25)], p[3], 1)
        for ringidx in range(2):
            t = (ringidx + 1) / 3
            for j in range(5):
                yy = cy + (-13 + j * 6) * t
                if j > 0:
                    line(d, [(x - 13 - ringidx * 7, yy), (x - 13 - ringidx * 7, yy + 6 * t)], p[2], 1)
    elif f < 13:
        scale = [0.55, 0.8, 1, 0.9][f - 9]
        x = 69
        y = 52
        corners = []
        for j in range(10):
            a = j * 2 * pi / 10 + 0.05
            corners.append((x + scale * 31 * cos(a), y + scale * 25 * sin(a)))
            line(d, [(x, y), corners[-1]], p[1], 2 if j % 3 == 0 else 1)
            line(d, [(x + 2 * scale * cos(a), y + 2 * scale * sin(a)), corners[-1]], p[3], 1)
        for radius in [0.35, 0.65, 1]:
            pts = [(x + (cx - x) * radius, y + (cy - y) * radius) for cx, cy in corners]
            line(d, pts + [pts[0]], p[2 if radius < 1 else 3], 2 if radius == 1 else 1)
        for j in range(4):
            a = j * pi / 2
            xx = x + 30 * scale * cos(a)
            yy = y + 24 * scale * sin(a)
            circ(d, xx, yy, 2, p[4])
            circ(d, xx, yy + 3, 1, p[5])
    else:
        a = (16 - f) / 3
        x = 70
        y = 52
        for k in range(3):
            rr = (9 + k * 8) * a
            pts = [(x + rr * cos(j * pi / 3), y + rr * 0.75 * sin(j * pi / 3)) for j in range(6)]
            line(d, pts + [pts[0]], p[2], 1)
        for j in range(5):
            tiny(d, x - 20 + j * 9, y - 10 + j % 3 * 11, p[3])

def venoshock(d, f, rng):
    p = COLORS['venoshock']
    x = 20 + min(1, max(0, (f - 3) / 5)) * 53
    y = 46
    if f < 3:
        for j in range(3 + f):
            t = j * 2 * pi / (3 + f)
            circ(d, 20 + 8 * cos(t), 50 + 8 * sin(t), 2 + f, p[1 + j % 3])
        jag(d, [(25, 36), (19, 45), (27, 50), (19, 60)], p[1], p[4])
    elif f < 9:
        for j in range(3):
            yy = 29 + j * 13
            pts = []
            for k in range(5):
                xx = x - 30 + k * 11
                pts.append((xx, yy + (-1) ** (j + k) * (3 + j % 2) * sin((f + j) * 1.2)))
            jag(d, pts, p[1], p[3 if j == 1 else 4])
        poly(d, [(x - 6, 34), (x + 6, 34), (x + 13, 46), (x + 7, 58), (x - 5, 62), (x - 12, 50)], p[1])
        poly(d, [(x - 3, 39), (x + 5, 39), (x + 9, 47), (x + 4, 55), (x - 5, 54)], p[3])
        for j in range(7):
            xx = x - 30 + j * 9 % 45
            yy = y - 17 + j * 13 % 33
            if xx > 0:
                circ(d, xx, yy, 1 + j % 2, p[4])
    elif f < 13:
        a = [0.6, 1, 1, 0.75][f - 9]
        x = 72
        paths = [[(x - 12, 6), (x - 5, 18), (x - 13, 31), (x + 1, 42), (x - 4, 55), (x + 3, 65)], [(x + 16, 12), (x + 8, 26), (x + 17, 38), (x + 3, 48), (x + 10, 63)], [(x - 20, 26), (x - 13, 35), (x - 22, 49), (x - 9, 59)]]
        for j, pts in enumerate(paths):
            pts = [(x + (xx - x) * a, 70 + (yy - 70) * a) for xx, yy in pts]
            jag(d, pts, p[1], p[4 if j == 0 else p.index(p[3])])
        ring(d, x, 67, 20 * a, p[2], 2, ry=7 * a)
        for j in range(9):
            xx = x - 25 + j * 6
            h = (10 + j * 7 % 14) * a
            poly(d, [(xx - 3, 72), (xx - 2, 65), (xx + (-1) ** j * 5, 71 - h), (xx + 4, 65), (xx + 6, 72)], p[1 + j % 2])
            line(d, [(xx + 1, 68), (xx + (-1) ** j * 5, 72 - h)], p[4 if j % 2 else 3], 1)
        for j in range(9):
            xx = x - 22 + j * 11 % 44
            yy = 62 - j * 13 % 26
            spark(d, xx, yy, 2 * a, p[4 if j % 2 else 3])
            if j % 3 == 0:
                line(d, [(xx, yy + 3), (xx - 2, yy + 12 * a)], p[2], 2)
    else:
        a = (16 - f) / 4
        x = 72
        for j in range(11):
            xx = x - 27 + j * 17 % 54
            yy = 38 + j * 13 % 40
            circ(d, xx, yy, 2 * a, p[1 + j % 3])
            if j % 2 == 0:
                tiny(d, xx, yy, p[4])

def signalbeam(d, f, rng):
    p = COLORS['signal-beam']
    x = 21 + min(1, max(0, (f - 3) / 5)) * 55
    y = 48
    if f < 3:
        for j in range(f + 2):
            a = j * 2 * pi / (f + 2)
            circ(d, 22 + 12 * cos(a), 48 + 12 * sin(a), 3, p[2 + j % 3])
        ring(d, 22, 48, 8 + f * 3, p[3], 1, ry=9 + f * 2)
    elif f < 9:
        t = (f - 3) / 5
        for j in range(4):
            xx = x - 30 + j * 8
            rr = 8 + j % 2 * 2
            if xx < 2:
                continue
            ring(d, xx, y, rr, p[3], 2, ry=rr * 0.66)
            for side in [-1, 1]:
                poly(d, [(xx - 6, y + side * rr), (xx - 13, y + side * (rr + 6)), (xx + 3, y + side * (rr - 1))], p[(j + side) % 3 + 1])
        line(d, [(x - 39, y), (x + 18, y)], p[0], 7)
        line(d, [(x - 37, y), (x + 18, y)], p[2], 4)
        line(d, [(x - 36, y), (x + 18, y)], p[4], 2)
        for j in range(8):
            bx = x - 32 + j * 7
            by = y + sin(j * 1.9 + f) * 12
            if bx > 2:
                circ(d, bx, by, 2, p[3 if j % 2 else 5])
    elif f < 13:
        a = [0.5, 0.85, 1, 0.64][f - 9]
        x = 72
        y = 49
        for k in range(2):
            rr = (14 + k * 13) * a
            hexpts = [(x + rr * cos(j * pi / 3 + 0.24), y + rr * 0.8 * sin(j * pi / 3 + 0.24)) for j in range(6)]
            line(d, hexpts + [hexpts[0]], p[2 + k], 2 if k == 0 else 1)
        for j in range(8):
            ang = j * pi / 4
            dx, dy = (cos(ang), sin(ang))
            rr = (16 + j % 3 * 6) * a
            base = (x + dx * rr, y + dy * rr)
            tang = (-dy, dx)
            pts = [(base[0] - dx * 5 * a, base[1] - dy * 5 * a), (base[0] + tang[0] * 5 * a, base[1] + tang[1] * 5 * a), (base[0] + dx * (9 + j % 2 * 5) * a, base[1] + dy * (9 + j % 2 * 5) * a), (base[0] - tang[0] * 5 * a, base[1] - tang[1] * 5 * a)]
            poly(d, pts, p[j % 4 + 1])
            line(d, [pts[0], pts[2]], p[5 if j % 2 else 4], 1)
        for j in range(7):
            xx = x - 21 + j * 11 % 42
            yy = y - 23 + j * 17 % 45
            spark(d, xx, yy, 1 + j % 3, p[4 if j % 2 else 5])
        poly(d, [(x, y - 6 * a), (x + 8 * a, y), (x, y + 6 * a), (x - 8 * a, y)], p[4])
        spark(d, x, y, 4 * a, p[5])
    else:
        a = (16 - f) / 3
        for j in range(7):
            xx = 44 + j * 17 % 49
            yy = 27 + j * 11 % 44
            poly(d, [(xx, yy - 3 * a), (xx + 4 * a, yy), (xx, yy + 3 * a), (xx - 4 * a, yy)], p[1 + j % 5])
ART = [sacred, aeroblast, octazooka, spiderweb, venoshock, signalbeam]
full = Image.new('RGBA', (4 * S, 4 * 6 * S), (0, 0, 0, 0))
manifest = []
preview = Image.new('RGBA', (6 * 320, 260), (12, 29, 45, 255))
dp = ImageDraw.Draw(preview)
for m, (name, artist) in enumerate(zip(MOVES, ART)):
    sheet = Image.new('RGBA', (4 * S, 4 * S), (0, 0, 0, 0))
    checks = []
    for f in range(16):
        im = Image.new('RGBA', (S, S), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        rng = random.Random(38179 + m * 1327 + f * 239)
        artist(d, f, rng)
        strengths = {'sacred-fire': 0.21 if f in (3, 4, 5, 6, 7, 8, 9, 10, 11, 12) else 0, 'aeroblast': 0.28 if f in (4, 5, 6, 7, 8, 9, 10, 11) else 0, 'octazooka': 0.25 if f in (4, 5, 6, 7, 8, 9, 10, 11) else 0, 'spider-web': 0.25 if f in (4, 5, 6, 7, 8, 9, 10, 11) else 0, 'venoshock': 0.0, 'signal-beam': 0.17 if f in (3, 4, 5, 6, 7, 8) else 0}
        amt = strengths[name]
        if amt:
            old = Image.open(ROOT.parent / 'six-pixelart-v2/assets/all-six-16frames.png').convert('RGBA')
            xold = f % 4 * S
            yold = (m * 4 + f // 4) * S
            old = old.crop((xold, yold, xold + S, yold + S))
            import numpy as np
            pix = np.array(old)
            brightness = pix[:, :, :3].max(axis=2).astype('float32')
            strength = np.clip((brightness - 70) / 135, 0, 1)
            pix[:, :, 3] = (pix[:, :, 3].astype('float32') * strength * (amt * 2.2)).astype('uint8')
            old = Image.fromarray(pix, 'RGBA')
            old.alpha_composite(im)
            im = old
        if name == 'venoshock' and f in (9, 10, 11):
            e = ImageDraw.Draw(im)
            for j in range(5):
                xx = 70 + (j - 2) * 7
                yy = 72 + j % 2 * 2
                line(e, [(xx, yy), (xx + (j - 2) * 2, yy - 10), (xx + (j - 2) * 4, yy - 15)], COLORS[name][1], 3)
                line(e, [(xx, yy), (xx + (j - 2) * 2, yy - 10), (xx + (j - 2) * 4, yy - 15)], COLORS[name][4], 1)
        if name == 'venoshock' and f == 11:
            tiny(ImageDraw.Draw(im), 79, 29, COLORS[name][5])
        assert im.getbbox(), (name, f)
        checks.append(hashlib.sha256(im.tobytes()).hexdigest())
        x = f % 4 * S
        y = f // 4 * S
        sheet.alpha_composite(im, (x, y))
        full.alpha_composite(im, (x, (m * 4 + f // 4) * S))
    if len(set(checks)) != 16:
        print('DUPLICATE', name, [(i, j) for i in range(16) for j in range(i + 1, 16) if checks[i] == checks[j]])
    file = OUT / (name + '.png')
    sheet.save(file, optimize=True)
    im = sheet.crop((S, 2 * S, 2 * S, 3 * S)).resize((192, 192), Image.Resampling.NEAREST)
    preview.alpha_composite(im, (m * 320 + 64, 30))
    dp.text((m * 320 + 30, 229), name.upper(), fill=(208, 232, 238), stroke_width=0)
    manifest.append({'name': name, 'file': 'assets/' + name + '.png', 'frames': 16, 'px': [S, S], 'sha256': hashlib.sha256(file.read_bytes()).hexdigest(), 'uniqueFrames': len(set(checks)), 'bytes': file.stat().st_size})
full.save(OUT / 'six-frame-atlas.png', optimize=True)
preview.save(ROOT / 'contact-sheet.png')
meta = {'revision': 'v3-distinct-shapes', 'userVisualApproval': False, 'gameIntegration': False, 'style': '2D pixel art, 96px frames, individual silhouettes; native atlas no CSS FX', 'atlas': 'assets/six-frame-atlas.png', 'atlasSize': [384, 2304], 'sha256': hashlib.sha256((OUT / 'six-frame-atlas.png').read_bytes()).hexdigest(), 'moves': manifest}
(ROOT / 'manifest.json').write_text(json.dumps(meta, indent=2))
print('ALL DONE', [(m['name'], m['bytes']) for m in manifest], 'atlas', (OUT / 'six-frame-atlas.png').stat().st_size)
