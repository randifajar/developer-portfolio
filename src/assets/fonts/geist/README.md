# Geist, for the social cards

These files let the social-card renderer draw the site's typeface, Geist, in the two weights the
cards use: Regular (400) and Bold (700). See `renderSocialCard` in
`src/domain/metadata/social-card.tsx` and DEC-078.

They are read at build time from the repository. Nothing is fetched, and nothing here is served
to visitors; the website itself loads Geist through `next/font`.

## Source

The official Geist release, [`vercel/geist-font`](https://github.com/vercel/geist-font), tag
`v1.9.2` (2026-11-06). The files are unmodified.

| File                | From the tag                        | Size          | Git blob                                   |
| ------------------- | ----------------------------------- | ------------- | ------------------------------------------ |
| `Geist-Regular.ttf` | `fonts/Geist/ttf/Geist-Regular.ttf` | 126,048 bytes | `71cb8160a35149c54c83f5ea92f034f3bae67e61` |
| `Geist-Bold.ttf`    | `fonts/Geist/ttf/Geist-Bold.ttf`    | 128,824 bytes | `5b071f457e33d42096249e3be9327f83c4440b56` |
| `OFL.txt`           | `OFL.txt`                           | 4,384 bytes   | `999fa2373263f4ce66077075c9ede594c6a49510` |

To check a file against the release, compare `git hash-object <file>` with the blob above. The
tag's tree lists the same blob for that path.

## Licence

SIL Open Font License 1.1, in `OFL.txt` beside these files. The notice reads "Copyright 2026 The
Geist Project Authors". The fonts are redistributed unmodified, with that licence, as the OFL
allows.

## What the font files say about themselves

Both are TrueType, version 1.800, family "Geist", with embedding permitted (`fsType` 0). The
Regular's style is "Regular" with weight class 400; the Bold's is "Bold" with weight class 700. A
test reads these tables, so a swapped or mislabelled file fails the build's tests.
