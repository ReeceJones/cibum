import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ConstraintOperator, ProfileConstraintType } from "./gql/graphql";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mapOperator(operator: ConstraintOperator) {
  switch (operator) {
    case ConstraintOperator.Equal:
      return "=";
    case ConstraintOperator.GreaterThan:
      return ">";
    case ConstraintOperator.GreaterThanOrEqual:
      return "≥";
    case ConstraintOperator.LessThan:
      return "<";
    case ConstraintOperator.LessThanOrEqual:
      return "≤";
    case ConstraintOperator.NotEqual:
      return "≠";
  }
}

export function mapProfileConstraintType(type: ProfileConstraintType) {
  switch (type) {
    case ProfileConstraintType.NetEnergy:
      return "Net Energy";
    case ProfileConstraintType.GrossEnergy:
      return "Gross Energy";
    case ProfileConstraintType.DigestibleEnergy:
      return "Digestible Energy";
    case ProfileConstraintType.MetabolizableEnergy:
      return "Metaoblizable Energy";
  }
}
