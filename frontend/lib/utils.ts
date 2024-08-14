import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ConstraintOperator } from "./gql/graphql"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function mapOperator(operator: ConstraintOperator) {
  switch (operator) {
    case ConstraintOperator.Equal:
      return "="
    case ConstraintOperator.GreaterThan:
      return ">"
    case ConstraintOperator.GreaterThanOrEqual:
      return "≥"
    case ConstraintOperator.LessThan:
      return "<"
    case ConstraintOperator.LessThanOrEqual:
      return "≤"
    case ConstraintOperator.NotEqual:
      return "≤"
  }
}
