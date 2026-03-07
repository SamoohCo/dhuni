#!/usr/bin/env python3

from __future__ import annotations

import math
import struct
import zlib
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parent.parent
PUBLIC_DIR = ROOT_DIR / "public"


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    clean = value.strip().lstrip("#")
    if len(clean) == 3:
        clean = "".join(ch * 2 for ch in clean)
    return int(clean[0:2], 16), int(clean[2:4], 16), int(clean[4:6], 16)


def clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))


def lerp(start: float, end: float, t: float) -> float:
    return start + (end - start) * t


def mix_color(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return (
        round(lerp(a[0], b[0], t)),
        round(lerp(a[1], b[1], t)),
        round(lerp(a[2], b[2], t)),
    )


class Image:
    def __init__(self, width: int, height: int) -> None:
        self.width = width
        self.height = height
        self.data = bytearray(width * height * 4)

    def blend_pixel(self, x: int, y: int, color: tuple[int, int, int], alpha: int = 255) -> None:
        if x < 0 or y < 0 or x >= self.width or y >= self.height:
            return

        src_a = clamp(alpha, 0, 255) / 255.0
        if src_a <= 0:
            return

        index = (y * self.width + x) * 4
        dst_r = self.data[index]
        dst_g = self.data[index + 1]
        dst_b = self.data[index + 2]
        dst_a = self.data[index + 3] / 255.0

        out_a = src_a + dst_a * (1 - src_a)
        if out_a <= 0:
            return

        self.data[index] = round((color[0] * src_a + dst_r * dst_a * (1 - src_a)) / out_a)
        self.data[index + 1] = round((color[1] * src_a + dst_g * dst_a * (1 - src_a)) / out_a)
        self.data[index + 2] = round((color[2] * src_a + dst_b * dst_a * (1 - src_a)) / out_a)
        self.data[index + 3] = round(out_a * 255)


def fill_vertical_gradient(image: Image, top: tuple[int, int, int], bottom: tuple[int, int, int]) -> None:
    for y in range(image.height):
        t = y / max(1, image.height - 1)
        color = mix_color(top, bottom, t)
        for x in range(image.width):
            idx = (y * image.width + x) * 4
            image.data[idx] = color[0]
            image.data[idx + 1] = color[1]
            image.data[idx + 2] = color[2]
            image.data[idx + 3] = 255


def fill_vertical_gradient_rect(
    image: Image,
    y_start: int,
    y_end: int,
    top: tuple[int, int, int],
    bottom: tuple[int, int, int],
    alpha: int = 255,
) -> None:
    start = max(0, min(image.height - 1, int(y_start)))
    end = max(0, min(image.height - 1, int(y_end)))
    if end < start:
        return

    span = max(1, end - start)
    for y in range(start, end + 1):
        t = (y - start) / span
        color = mix_color(top, bottom, t)
        for x in range(image.width):
            image.blend_pixel(x, y, color, alpha)


def fill_rect(
    image: Image,
    x: int,
    y: int,
    width: int,
    height: int,
    color: tuple[int, int, int],
    alpha: int = 255,
) -> None:
    x_start = max(0, x)
    y_start = max(0, y)
    x_end = min(image.width - 1, x + width)
    y_end = min(image.height - 1, y + height)
    for yi in range(y_start, y_end + 1):
        for xi in range(x_start, x_end + 1):
            image.blend_pixel(xi, yi, color, alpha)


def fill_ellipse(
    image: Image,
    cx: float,
    cy: float,
    rx: float,
    ry: float,
    color: tuple[int, int, int],
    alpha: int = 255,
) -> None:
    x_start = max(0, math.floor(cx - rx))
    x_end = min(image.width - 1, math.ceil(cx + rx))
    y_start = max(0, math.floor(cy - ry))
    y_end = min(image.height - 1, math.ceil(cy + ry))
    inv_rx_sq = 1 / max(1e-6, rx * rx)
    inv_ry_sq = 1 / max(1e-6, ry * ry)

    for y in range(y_start, y_end + 1):
        dy = y - cy
        for x in range(x_start, x_end + 1):
            dx = x - cx
            value = dx * dx * inv_rx_sq + dy * dy * inv_ry_sq
            if value <= 1:
                image.blend_pixel(x, y, color, alpha)


def fill_radial_gradient(
    image: Image,
    cx: float,
    cy: float,
    rx: float,
    ry: float,
    color: tuple[int, int, int],
    max_alpha: int = 255,
    exponent: float = 1.4,
) -> None:
    x_start = max(0, math.floor(cx - rx))
    x_end = min(image.width - 1, math.ceil(cx + rx))
    y_start = max(0, math.floor(cy - ry))
    y_end = min(image.height - 1, math.ceil(cy + ry))

    for y in range(y_start, y_end + 1):
        dy = (y - cy) / max(1e-6, ry)
        for x in range(x_start, x_end + 1):
            dx = (x - cx) / max(1e-6, rx)
            distance = math.sqrt(dx * dx + dy * dy)
            if distance <= 1:
                intensity = (1 - distance) ** exponent
                image.blend_pixel(x, y, color, round(max_alpha * intensity))


def fill_polygon(
    image: Image,
    points: list[tuple[float, float]],
    color: tuple[int, int, int],
    alpha: int = 255,
) -> None:
    if len(points) < 3:
        return

    min_y = max(0, math.floor(min(point[1] for point in points)))
    max_y = min(image.height - 1, math.ceil(max(point[1] for point in points)))

    for y in range(min_y, max_y + 1):
        intersections: list[float] = []
        for index in range(len(points)):
            x1, y1 = points[index]
            x2, y2 = points[(index + 1) % len(points)]
            y_min = min(y1, y2)
            y_max = max(y1, y2)
            if y >= y_min and y < y_max and y1 != y2:
                t = (y - y1) / (y2 - y1)
                intersections.append(x1 + t * (x2 - x1))

        intersections.sort()

        for i in range(0, len(intersections), 2):
            if i + 1 >= len(intersections):
                break
            x_start = max(0, math.floor(intersections[i]))
            x_end = min(image.width - 1, math.ceil(intersections[i + 1]))
            for x in range(x_start, x_end + 1):
                image.blend_pixel(x, y, color, alpha)


def draw_flame(
    image: Image,
    cx: float,
    top_y: int,
    bottom_y: int,
    max_width: float,
    sway_seed: float,
    top_color: tuple[int, int, int],
    bottom_color: tuple[int, int, int],
    max_alpha: int = 255,
) -> None:
    span = max(1, bottom_y - top_y)
    for y in range(top_y, bottom_y + 1):
        t = (y - top_y) / span
        profile = math.sin(math.pi * t) ** 0.78
        taper = 1 - 0.12 * t
        width = max(0.8, max_width * profile * taper)
        sway = math.sin((y + sway_seed) * 0.16) * 2 + math.sin((y + sway_seed) * 0.047) * 1.2
        color = mix_color(top_color, bottom_color, t)
        alpha = round(max_alpha * (0.85 + (1 - t) * 0.15))
        x_start = math.floor(cx + sway - width)
        x_end = math.ceil(cx + sway + width)
        for x in range(x_start, x_end + 1):
            image.blend_pixel(x, y, color, alpha)


def draw_character(
    image: Image,
    anchor_x: int,
    anchor_y: int,
    robe_hex: str,
    accent_hex: str,
) -> None:
    skin = hex_to_rgb("#d5b290")
    hair = hex_to_rgb("#2a2222")
    shadow = hex_to_rgb("#1a1b24")
    robe = hex_to_rgb(robe_hex)
    accent = hex_to_rgb(accent_hex)

    fill_rect(image, anchor_x + 4, anchor_y + 2, 8, 3, hair, 245)
    fill_rect(image, anchor_x + 5, anchor_y + 5, 6, 4, skin, 248)
    fill_rect(image, anchor_x + 4, anchor_y + 9, 8, 8, robe, 245)
    fill_rect(image, anchor_x + 2, anchor_y + 11, 2, 5, accent, 220)
    fill_rect(image, anchor_x + 12, anchor_y + 11, 2, 5, accent, 220)
    fill_rect(image, anchor_x + 5, anchor_y + 16, 6, 2, shadow, 220)
    fill_ellipse(image, anchor_x + 8, anchor_y + 22, 6, 2.4, shadow, 135)


FONT_5X7: dict[str, list[str]] = {
    " ": ["00000"] * 7,
    ".": ["00000", "00000", "00000", "00000", "00000", "01100", "01100"],
    "A": ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
    "B": ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
    "C": ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
    "D": ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
    "E": ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
    "F": ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
    "G": ["01110", "10001", "10000", "10111", "10001", "10001", "01110"],
    "H": ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
    "I": ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
    "L": ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
    "M": ["10001", "11011", "10101", "10001", "10001", "10001", "10001"],
    "N": ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
    "O": ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
    "P": ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
    "R": ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
    "S": ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
    "T": ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
    "U": ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
    "Y": ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
}


def measure_text(text: str, scale: int, letter_spacing: int) -> int:
    if not text:
        return 0
    return len(text) * (5 * scale + letter_spacing) - letter_spacing


def draw_text(
    image: Image,
    text: str,
    x: int,
    y: int,
    color: tuple[int, int, int],
    scale: int = 1,
    letter_spacing: int = 1,
    alpha: int = 255,
) -> None:
    cursor = x
    for raw_char in text:
        char = raw_char.upper()
        glyph = FONT_5X7.get(char, FONT_5X7[" "])
        for row_idx, row in enumerate(glyph):
            for col_idx, bit in enumerate(row):
                if bit == "1":
                    fill_rect(
                        image,
                        cursor + col_idx * scale,
                        y + row_idx * scale,
                        scale,
                        scale,
                        color,
                        alpha,
                    )
        cursor += 5 * scale + letter_spacing


def draw_centered_text(
    image: Image,
    text: str,
    center_x: int,
    y: int,
    color: tuple[int, int, int],
    scale: int = 1,
    letter_spacing: int = 1,
    alpha: int = 255,
) -> None:
    width = measure_text(text, scale, letter_spacing)
    draw_text(image, text, round(center_x - width / 2), y, color, scale, letter_spacing, alpha)


def apply_vignette(image: Image, strength: float = 0.38) -> None:
    center_x = image.width / 2
    center_y = image.height / 2
    max_distance = math.sqrt(center_x * center_x + center_y * center_y)
    shade = hex_to_rgb("#05070d")

    for y in range(image.height):
        for x in range(image.width):
            dx = x - center_x
            dy = y - center_y
            ratio = math.sqrt(dx * dx + dy * dy) / max_distance
            if ratio > 0.45:
                alpha = round(clamp((ratio - 0.45) / 0.55, 0, 1) * strength * 255)
                image.blend_pixel(x, y, shade, alpha)


def fill_rounded_rect_gradient(
    image: Image,
    x: int,
    y: int,
    width: int,
    height: int,
    radius: int,
    top: tuple[int, int, int],
    bottom: tuple[int, int, int],
) -> None:
    r = max(0, min(radius, min(width, height) // 2))
    x_end = x + width
    y_end = y + height

    for yy in range(y, y_end):
        t = clamp((yy - y) / max(1, height - 1), 0, 1)
        color = mix_color(top, bottom, t)
        for xx in range(x, x_end):
            inside = True
            if xx < x + r and yy < y + r:
                dx = xx - (x + r)
                dy = yy - (y + r)
                inside = dx * dx + dy * dy <= r * r
            elif xx > x_end - r - 1 and yy < y + r:
                dx = xx - (x_end - r - 1)
                dy = yy - (y + r)
                inside = dx * dx + dy * dy <= r * r
            elif xx < x + r and yy > y_end - r - 1:
                dx = xx - (x + r)
                dy = yy - (y_end - r - 1)
                inside = dx * dx + dy * dy <= r * r
            elif xx > x_end - r - 1 and yy > y_end - r - 1:
                dx = xx - (x_end - r - 1)
                dy = yy - (y_end - r - 1)
                inside = dx * dx + dy * dy <= r * r

            if inside:
                image.blend_pixel(xx, yy, color, 255)


def build_og_image() -> Image:
    image = Image(1200, 630)
    fill_vertical_gradient(image, hex_to_rgb("#101b30"), hex_to_rgb("#1e2a44"))
    fill_vertical_gradient_rect(image, 360, 629, hex_to_rgb("#2b2d3f"), hex_to_rgb("#20212f"), 250)

    fill_polygon(
        image,
        [
            (0, 330),
            (100, 300),
            (220, 320),
            (350, 310),
            (490, 332),
            (630, 298),
            (760, 315),
            (900, 302),
            (1030, 322),
            (1200, 308),
            (1200, 630),
            (0, 630),
        ],
        hex_to_rgb("#314362"),
        215,
    )

    fill_polygon(
        image,
        [
            (0, 390),
            (140, 410),
            (280, 385),
            (430, 408),
            (600, 392),
            (760, 412),
            (920, 398),
            (1060, 414),
            (1200, 396),
            (1200, 630),
            (0, 630),
        ],
        hex_to_rgb("#26324a"),
        232,
    )

    fill_radial_gradient(image, 600, 170, 450, 220, hex_to_rgb("#f3b473"), 38, 2.2)
    fill_radial_gradient(image, 600, 412, 215, 106, hex_to_rgb("#f2af6b"), 148, 1.9)
    fill_ellipse(image, 600, 450, 128, 42, hex_to_rgb("#2f2628"), 255)
    fill_ellipse(image, 600, 440, 106, 30, hex_to_rgb("#3a2f31"), 176)

    draw_flame(
        image,
        cx=600,
        top_y=254,
        bottom_y=428,
        max_width=50,
        sway_seed=16,
        top_color=hex_to_rgb("#fff1cc"),
        bottom_color=hex_to_rgb("#d67b4f"),
        max_alpha=248,
    )
    draw_flame(
        image,
        cx=600,
        top_y=286,
        bottom_y=412,
        max_width=29,
        sway_seed=41,
        top_color=hex_to_rgb("#fff8e3"),
        bottom_color=hex_to_rgb("#f4bd81"),
        max_alpha=215,
    )

    coal = hex_to_rgb("#95583f")
    fill_ellipse(image, 548, 428, 16, 10, coal, 215)
    fill_ellipse(image, 585, 432, 14, 10, coal, 230)
    fill_ellipse(image, 616, 433, 16, 10, coal, 228)
    fill_ellipse(image, 654, 429, 14, 9, coal, 210)

    ember = hex_to_rgb("#efbc7d")
    for x, y in [(580, 312), (614, 298), (630, 338), (566, 348), (635, 356), (600, 325)]:
        fill_rect(image, x, y, 7, 7, ember, 200)

    draw_character(image, 440, 390, robe_hex="#7d8fa9", accent_hex="#c5b193")
    draw_character(image, 742, 390, robe_hex="#5f99ab", accent_hex="#9cc4cf")
    draw_character(image, 308, 432, robe_hex="#6f7f99", accent_hex="#b9c2d3")
    draw_character(image, 874, 432, robe_hex="#8b8d9a", accent_hex="#d4c4aa")

    draw_centered_text(image, "DHUNI", 600, 92, hex_to_rgb("#f1e6d3"), scale=12, letter_spacing=3, alpha=245)
    draw_centered_text(
        image,
        "A SACRED DIGITAL CAMPFIRE",
        600,
        194,
        hex_to_rgb("#d6c5ad"),
        scale=5,
        letter_spacing=2,
        alpha=232,
    )
    draw_centered_text(image, "BY SAMOOH", 600, 548, hex_to_rgb("#ccb99d"), scale=5, letter_spacing=2, alpha=228)

    apply_vignette(image, 0.36)
    return image


def build_icon(size: int) -> Image:
    image = Image(size, size)
    fill_rounded_rect_gradient(
        image,
        0,
        0,
        size,
        size,
        round(size * 0.22),
        hex_to_rgb("#1f2a43"),
        hex_to_rgb("#0f1422"),
    )

    center_x = size / 2
    aura_y = size * 0.61
    pit_y = size * 0.68

    fill_radial_gradient(image, center_x, aura_y, size * 0.29, size * 0.2, hex_to_rgb("#f3b26d"), 142, 2.1)
    fill_ellipse(image, center_x, pit_y, size * 0.22, size * 0.09, hex_to_rgb("#2e2526"), 250)

    draw_flame(
        image,
        cx=center_x,
        top_y=round(size * 0.24),
        bottom_y=round(size * 0.76),
        max_width=size * 0.125,
        sway_seed=size * 0.4,
        top_color=hex_to_rgb("#fff1cc"),
        bottom_color=hex_to_rgb("#d67b4f"),
        max_alpha=250,
    )
    draw_flame(
        image,
        cx=center_x,
        top_y=round(size * 0.34),
        bottom_y=round(size * 0.70),
        max_width=size * 0.08,
        sway_seed=size * 0.8,
        top_color=hex_to_rgb("#fff8e3"),
        bottom_color=hex_to_rgb("#f4bd81"),
        max_alpha=208,
    )

    fill_ellipse(image, center_x - size * 0.12, pit_y - size * 0.1, size * 0.05, size * 0.035, hex_to_rgb("#94563d"), 220)
    fill_ellipse(image, center_x + size * 0.11, pit_y - size * 0.09, size * 0.047, size * 0.033, hex_to_rgb("#9f6042"), 215)

    apply_vignette(image, 0.28)
    return image


def png_chunk(chunk_type: bytes, data: bytes) -> bytes:
    return (
        struct.pack(">I", len(data))
        + chunk_type
        + data
        + struct.pack(">I", zlib.crc32(chunk_type + data) & 0xFFFFFFFF)
    )


def encode_png(image: Image) -> bytes:
    stride = image.width * 4
    rows = bytearray((stride + 1) * image.height)
    for y in range(image.height):
        row_offset = y * (stride + 1)
        rows[row_offset] = 0
        src_start = y * stride
        rows[row_offset + 1 : row_offset + 1 + stride] = image.data[src_start : src_start + stride]

    compressed = zlib.compress(bytes(rows), level=9)
    signature = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", image.width, image.height, 8, 6, 0, 0, 0)
    return signature + png_chunk(b"IHDR", ihdr) + png_chunk(b"IDAT", compressed) + png_chunk(b"IEND", b"")


def write_png(path: Path, image: Image) -> None:
    path.write_bytes(encode_png(image))
    print(f"created {path}")


def main() -> None:
    write_png(PUBLIC_DIR / "og-image.png", build_og_image())
    write_png(PUBLIC_DIR / "favicon-32.png", build_icon(32))
    write_png(PUBLIC_DIR / "apple-touch-icon.png", build_icon(180))


if __name__ == "__main__":
    main()
