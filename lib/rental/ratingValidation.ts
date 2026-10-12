export interface RentalRatingInput {
  key: string;
  stars: number;
  inspected: string;
}

const RENTAL_KEY = /^[\w|\- ]+$/;
const INSPECTED_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isRentalRatingInput(value: unknown): value is RentalRatingInput {
  if (!value || typeof value !== "object") return false;
  const input = value as Partial<RentalRatingInput>;
  return typeof input.key === "string"
    && RENTAL_KEY.test(input.key)
    && Number.isInteger(input.stars)
    && input.stars! >= 0
    && input.stars! <= 5
    && typeof input.inspected === "string"
    && (input.inspected === "" || INSPECTED_DATE.test(input.inspected));
}
