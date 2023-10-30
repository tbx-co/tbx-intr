## Free style title

Notes:

##### Custom Classes 
|  Class | Function   |  
|--------|------------|
| line-X-right, line-X-center, line-X-left | text-align in each line (tablet & up) |  
| mobile-text-center, mobile-text-right | text alignment of all lines (mobile) |
| highlight-dot | period '.' color - grey |
| highlight-dot-blue | period '.' color - blue |
| highlight-dot-light | period '.' opacity - 50% |
| text-large | largest h1 font size |

#### Example:
See Live output (Link):
https://main--tbx-intr--tbx-co.hlx.page/drafts/blocks/free-style-title

#### Content Structure:

See Content in Document (Link):
https://docs.google.com/document/d/18004R6dVKVUWiSvGNlcabmZN0uWsGr98oqAX7XJL7zM/edit

#### Code:
- Heading: h1/h2/h3/h4/h5/h6 (separate to differnt lines based on design)
    - tablet & up: each line display as block
    - mobile: each line display as inline
- Can use utility class for decorating + bold text to have effect, e.g.  deco-bold-zigzag, deco-bold-circle...etc

[Decoration Code](free-style-title.js)

The CSS Styling is very project specific and gets adjusted as needed for a project or block by block.

[Styling Code](free-style-title.css)