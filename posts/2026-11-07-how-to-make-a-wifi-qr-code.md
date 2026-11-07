---
title: "How to Make a Wi-Fi QR Code (Free, for Guests and Cafes)"
description: "Make a Wi-Fi QR code so guests join your network with one scan. Copy-and-paste format, step-by-step instructions and safety tips. Free, no sign-up."
tools: [qr]
---
Every host has had this moment. A guest sits down and asks for the Wi-Fi password. You read out a long mix of letters and numbers, they mistype it twice, and the conversation moves on. A Wi-Fi QR code fixes this. The guest points the phone camera at the code, taps one button, and they are connected. This guide shows you how to make one for free, how to print it, and how to keep your network safe.

## What a Wi-Fi QR code is

A Wi-Fi QR code is an ordinary QR code that holds a short line of text. That text tells the phone three things: the name of your network, the password, and the type of security. Current phones read this line and offer to join the network. There is no app to install and no account to create.

Because it is only text, you can make one with any QR code generator that accepts plain text. Our [QR code generator](/qr-code-generator/) does this, and it draws the code in your browser, so your password is not sent to a server.

## The text format

The line always starts with `WIFI:` and ends with two semicolons. Here is the pattern:

`WIFI:T:WPA;S:YourNetworkName;P:YourPassword;;`

| Part | Meaning | What to write |
|---|---|---|
| `T:` | Security type | `WPA` for most home and office networks, `WEP` for very old ones, `nopass` for an open network |
| `S:` | Network name (SSID) | The name exactly as it appears in the Wi-Fi list |
| `P:` | Password | Your Wi-Fi password, exactly as you type it |
| `H:` | Hidden network (optional) | `true` only if the network name is not broadcast |

`WPA` works for WPA2 and for most WPA3 networks. If you are not sure which type you have, look at your router settings, or try `WPA` first.

### Examples

A normal home network:

`WIFI:T:WPA;S:HomeNetwork;P:blue-river-2026;;`

An open guest network with no password:

`WIFI:T:nopass;S:CafeGuest;;`

A hidden network:

`WIFI:T:WPA;S:OfficeStaff;P:green-hill-42;H:true;;`

### Special characters

Four characters have a special meaning in this format: the backslash, the semicolon, the comma and the colon. The double quote too. If your network name or password contains any of them, put a backslash in front. For example, the password `ab;cd` is written as `ab\;cd`. Spaces and ordinary letters, numbers and symbols need nothing extra.

## Step by step

1. Find your exact network name and password. Copy them from your router page if you can, so there are no typing mistakes.
2. Write the text line using the pattern above. Check the capital letters, because passwords are case sensitive.
3. Open the [QR code generator](/qr-code-generator/) and paste the line into the box for link or text.
4. Wait for the code to appear and download it. Choose PNG for a document or a screen, or SVG if you will print it large.
5. Test it on your own phone before you print. Switch Wi-Fi off, scan the code, and check that your phone offers to join the network.
6. Test it on a second phone, ideally a different brand.

## How guests scan it

On recent iPhones and Android phones, the built-in camera app recognises a Wi-Fi code. The phone shows a short message with the network name and a button to join. The guest taps it and is connected. Older phones may need a QR scanner app. If someone's phone does not react, ask them to try the camera app first, then a scanner app.

## Where to put it

- **At home:** on the fridge, near the door, or in a small frame in the guest room.
- **In a cafe or shop:** on the counter or on each table. If you already use a menu code, see our guide to [QR codes for restaurant menus](/blog/qr-codes-for-restaurant-menus/).
- **In a rental or office:** in the welcome folder or on the wall of the meeting room.

Add a short line of plain text under the code, such as the network name and "Scan to join", so people know what it is.

## Print it so it scans

A Wi-Fi code carries more text than a short web address, so it has more small squares. Keep these points in mind:

- Print it at least about 3 cm (1.2 in) wide. Larger is better for table or wall use.
- Use dark squares on a light background and keep the white border around the code.
- Do not stretch it, rotate it into a curve or place it over a busy photo.
- Test the printed copy, not only the screen.

Our guides on [QR code size and contrast](/blog/qr-code-size-and-contrast-guide/) and [why a QR code does not scan](/blog/why-your-qr-code-is-not-scanning/) cover these in more detail.

## Keep your network safe

A Wi-Fi QR code contains your password in a form that any QR reader can show as plain text. Anyone who can scan it can also read it. Treat it like writing the password on the wall.

- **Use a guest network.** Most routers let you create a separate guest network. Put the code for that network on display and keep your main network private.
- **Change the password if it spreads.** If the code ends up somewhere you did not intend, change the Wi-Fi password and make a new code.
- **Replace old codes.** A code stops working when you change the password. Remove the old printed copies so people do not get stuck.
- **Do not post it online.** A photo of the code on social media gives your password to everyone who sees it.

This also explains a point from our guide on [static and dynamic QR codes](/blog/static-vs-dynamic-qr-codes/). A Wi-Fi code is a static code: the information is inside the pattern itself. It never expires and needs no internet to be read, but you cannot change it later without making a new one.

## Common problems

- **The phone does not offer to join.** Check that the text starts with `WIFI:` and ends with `;;`, with no spaces at the start or end.
- **It joins but there is no internet.** The code only connects the phone. If the router has no internet, the phone will connect but not load pages.
- **It fails to connect.** Re-type the password into the text line. A single wrong capital letter will stop it. Also check the security type.
- **It is hard to scan.** Make the printed code larger and check the contrast.

## Quick checklist

- Network name and password copied exactly.
- Security type set (`WPA`, `WEP` or `nopass`).
- Text line ends with two semicolons.
- Tested on two phones.
- Printed large enough and with a white border.
- Guest network used, if possible.

## Make yours now

Open the [QR code generator](/qr-code-generator/), paste your Wi-Fi line and download the code. It is free, there is no watermark, and you do not need to sign up. If you also want to share a web address, you can read how in our guide to [making a QR code for a link](/blog/how-to-make-a-qr-code-for-a-link/).
