export function saturation2Code(val) {
  let code = 'F';
  if (val >= 0 && val <= 0.08) {
    code = 'A';
  } else if (val > 0.08 && val <= 0.28) {
    code = 'B';
  } else if (val > 0.28 && val <= 0.4) {
    code = 'C';
  } else if (val > 0.4 && val <= 0.6) {
    code = 'D';
  } else if (val > 0.6 && val <= 1) {
    code = 'E';
  }
  return code;
}
