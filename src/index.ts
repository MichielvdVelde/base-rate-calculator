
/** Calculate the base reward. */
export function calcReward(
  volume: number,
  jumps: number,
  collat: number,
  type: 'L' | 'H',
  rush: boolean,
) {
  if (!volume || !jumps || !collat) {
    return
  }

  var base = 1e6;
  var add = 0;
  var mult = 1;
  if (volume <= 12e3) { mult *= 1; }
  else if (volume <= 60e3) { mult *= 1; }
  if (volume > 62500 && collat < 1e9) { collat = (3e9 + collat) / 4; }//low freighter collat pays more
  if (volume <= 60000 && volume > 12000 && collat < 1e9) { collat = (1e9 + collat) / 2; }//low DST collat pays more
  if (volume <= 12000 && collat < 1e9) { collat = (100e6 + collat) / 1.1; }//low BR/t1 collat pays more

  if (jumps < 1) { jumps = 1; }//same system counts as 1 jump
  if (jumps < 5) {//low jumps pay more.
    jumps = (5 + jumps) * 0.5;
  }
  /*
  if (collat >1e9 && volume <= 60e3){//progressive rebate for very high collats
    mult /= Math.max(1.0,Math.log( collat/1e8)/Math.log(10));
  }
  */
  if (collat > 3e9 && volume > 60e3) {
    mult *= Math.max(1.0, Math.log(collat / 15e7) / Math.log(15));
  }

  if (volume > 1050e3) {
    add += 250e3;
    if (collat > 2e9) {
      add += 200e3;
    }
  }
  else if (volume > 880e3) {
    if (collat > 1.5e9) {
      add += 100e3;
    }
    if (collat > 2.5e9) {
      add += 100e3;
    }
    if (collat > 3e9) {
      add += 200e3;
    }
  }
  else if (volume > 750e3) {
    if (collat > 2.5e9) {
      add += 100e3;
    }
    if (collat > 3e9) {
      add += 200e3;
    }
  }
  else if (volume > 500e3) {
    if (collat > 2.0e9) {
      add += 100e3;
    }
    if (collat > 3.5e9) {
      add += 100e3;
    }
  }

  if (rush) {
    if (collat > 2e9) {
      mult *= 2.0 * Math.max(1.0, Math.log(collat / 1e8) / Math.log(20));
    }
    else {
      mult *= 2.0;
    }
    if (type === 'L') { mult *= 2; }
  }
  if (type === 'L') {
    mult *= 2;
    //Non JF lowsec pays double.
  }
  if (type === 'H' || volume <= 62500) {//highsec or non JF lowsec
    return ((mult * base * collat / 1e9) + add) * jumps;
  }
  else if (type === 'L' && volume > 386e3) {
    return "Does not fit";
  }
  else {//null, JF
    base = 60e6;
    if (volume < 100) { mult = 0.25; }
    else if (volume <= 12e3) { mult = 0.5; }
    else if (volume <= 60e3) { mult = 0.75; }
    else if (volume <= 340e3) { mult = 1; }
    else { mult = 4; }
    if (rush) {
      mult *= 2;
    }
    return (mult * base * (Math.max(1.0, jumps / 7)) + collat * 0.01);
  }
}