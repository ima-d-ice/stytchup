#!/usr/bin/env bash
# Downloads the demo imagery used by the storefront and fixtures.
# All photographs are from Unsplash and used under the Unsplash License.
set -u

DIR="$(cd "$(dirname "$0")/.." && pwd)/public/demo"
mkdir -p "$DIR"

fetch() {
  local name="$1"
  local id="$2"
  local width="${3:-1200}"
  local out="$DIR/$name.jpg"
  if [ -f "$out" ]; then
    echo "skip  $name"
    return 0
  fi
  if curl -L --fail --silent --show-error \
    "https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80" \
    -o "$out"; then
    echo "ok    $name"
  else
    echo "FAIL  $name ($id)"
  fi
}

fetch hero 1539109136881-3be0616acf4b 1600
fetch auth 1469334031218-e382a71b716b 1200
fetch category-women 1487222477894-8943e31ef7b2 1000
fetch category-men 1551028719-00167b16eac5 1000
fetch category-custom 1445205170230-053b83016050 1000
fetch editorial 1558769132-cb1aea458c5e 1400

fetch design-01 1539109136881-3be0616acf4b 900
fetch design-01b 1485968579580-b6d095142e6e 900
fetch design-02 1487222477894-8943e31ef7b2 900
fetch design-02b 1515372039744-b8f02a3ae446 900
fetch design-03 1521572163474-6864f9cf17ab 900
fetch design-03b 1598033129183-c4f50c736f10 900
fetch design-04 1529139574466-a303027c1d8b 900
fetch design-04b 1496747611176-843222e1e57c 900
fetch design-05 1509631179647-0177331693ae 900
fetch design-05b 1483985988355-763728e1935b 900
fetch design-06 1551028719-00167b16eac5 900
fetch design-06b 1542272604-787c3835535d 900
fetch design-07 1434389677669-e08b4cac3105 900
fetch design-07b 1515886657613-9f3515b0c78f 900
fetch design-08 1469334031218-e382a71b716b 900
fetch design-08b 1490481651871-ab68de25d43d 900
fetch design-09 1591047139829-d91aecb6caea 900
fetch design-09b 1602810318383-e386cc2a3ccf 900
fetch design-10 1524504388940-b1c1722653e1 900
fetch design-10b 1506794778202-cad84cf45f1d 900

fetch designer-01 1534528741775-53994a69daeb 900
fetch designer-02 1506794778202-cad84cf45f1d 900
fetch designer-03 1524504388940-b1c1722653e1 900
fetch designer-04 1500648767791-00dcc994a43e 900
fetch customer 1507003211169-0a1dd7228f2d 900
