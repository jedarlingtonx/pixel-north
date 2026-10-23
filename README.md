# Pixel North website

A single-page website for Pixel North: *Small business sites, sorted.*

It is plain HTML, CSS, and a little JavaScript in one file, with no build step and no dependencies. The only external request is Google Fonts (Outfit and DM Sans).

## Files

- `index.html`: the whole site

## Before you publish

1. **Set your email address.** Near the bottom of `index.html`, change the `EMAIL` value from `hello@example.com` to your real address. The contact form opens a pre-filled email to that address in the visitor's email app. To receive enquiries directly, connect a form service later.
2. **Check the statistics.** The "Why your small business needs a website" section quotes Ofcom, ONS, DataReportal, and Squarespace/YouGov figures. Open the original sources and confirm the numbers and wording.
3. **Add real proof when you have it.** Timelines, client sites, testimonials, and an About section are not on the page yet.

## Deploy with GitHub Pages

1. Create a repository and add `index.html` (and this README) to the main branch.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and the `/ (root)` folder, then save.
4. After a minute or two, the site is live at the address shown on that page.
5. To use your own domain, add it under **Custom domain** on the same page and set the DNS records your domain provider asks for.

Other static hosts (Netlify, Cloudflare Pages, Vercel) also work: point them at the repository and leave the build command empty.

## Brand reference

- Colours: North Violet `#5B21E6`, Pixel Pink `#FF3D8B`, Midnight Ink `#1A1033`, Lilac Mist `#F1EBFF`, White `#FFFFFF`
- Typefaces: Outfit (headings), DM Sans (body)
- The colours are CSS variables at the top of the `<style>` block, with a dark mode that follows the visitor's device setting.
