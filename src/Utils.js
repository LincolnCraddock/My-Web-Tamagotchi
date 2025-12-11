export function clamp(min, value, max) {
  if (typeof min === "number") value = Math.max(min, value);
  else value = Math.max(...min, value);
  if (typeof max === "number") value = Math.min(value, max);
  else value = Math.min(value, ...max);
  return value;
}
