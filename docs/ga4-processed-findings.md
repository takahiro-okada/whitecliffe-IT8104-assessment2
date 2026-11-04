# GA4 processed report observations

Analysis period: 3 November 2026. Property: Kiwi Outdoor — IT8104 Assignment 2 (558872734). Source: GA4 standard Ecommerce purchases and Purchase journey reports.

The Ecommerce purchases report contains 14 items viewed, 13 items added to cart, 11 items purchased and NZ$377 item revenue. Product-level purchased quantities and revenue match the saved receipts and purchase payloads for the eight controlled orders. Items purchased is a quantity measure, so 11 items does not mean 11 transactions.

| Product | Items viewed | Items added to cart | Items purchased | Item revenue (NZD) |
|---|---:|---:|---:|---:|
| Hiking Bottle | 3 | 3 | 2 | 50 |
| Hoodie | 3 | 2 | 2 | 130 |
| NZ T-Shirt | 3 | 3 | 2 | 70 |
| Travel Mug | 3 | 3 | 3 | 87 |
| Tote Bag | 2 | 2 | 2 | 40 |
| Total | 14 | 13 | 11 | 377 |

The closed Purchase journey report counts one desktop user at each step: Session start, View product, Add to cart, Begin checkout and Purchase. It displays 100% progression and zero abandonment. These figures reflect repeated controlled activity by the same user. Deliberately stopping some workflows does not create distinct nonconverting users in a user-count funnel. The resulting 100% must not be presented as commercial conversion performance. Likewise, 11/14 is not a valid user/session conversion rate: item quantities and users have different denominators.

The Hoodie contributes NZ$130, approximately 34.48% of simulated item revenue, despite the same two-unit purchased quantity as several lower-priced products. This illustrates how price and chosen basket composition affect revenue; it does not establish customer preference or a profitable pricing intervention. Travel Mug has three purchased units because of the selected test baskets. Source/medium and device comparisons cannot establish meaningful segment differences from this single-user exercise.

Earlier verification traffic is excluded by using the single-day period above. A wider 7 October–3 November view showed NZ$819 and 25 purchased items; those figures must not be substituted for this batch's period. Screenshots preserve the period, report name and displayed values. The single-day CSV and processed_report_summary.json record the transcribed observations, checked against local order totals.
