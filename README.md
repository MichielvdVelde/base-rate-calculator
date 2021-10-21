# Haulers Channel Base Rate Calculator

The
[Base Rate Calculator](https://kujara.github.io/haulers-channel-reward-calc/ogb.html)
as a stand-alone node.js module.

All I have done is extract the code from the calculator. All credit for its
development goes to the original author(s).

## Install

```
> npm i @ageira/base-rate-calculator [--save]
```

## Usage

```ts
import { calcReward } from "@ageira/base-rate-calculator";

const reward = calcReward(
  100000, // volume
  4, // jumps
  1000000000, // collateral
  "H", // type - 'H' for high-sec only, 'L' for low/nullsec
  false, // rush
);
```
