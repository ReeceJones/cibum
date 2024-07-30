"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  organizationDietsRoute,
  organizationIngredientsRoute,
  organizationNutritionRoute,
  organizationConstraintsRoute,
  organizationRoute,
} from "@/lib/routes/organization";
import { OrganizationSwitcher, useAuth, UserButton } from "@clerk/nextjs";
import { IconGrain } from "@tabler/icons-react";
import Link from "next/link";

export function AppNavigationMenu() {
  const { orgSlug } = useAuth();

  return (
    <div className="w-full border-b shadow-sm p-2 bg-background">
      <div className="container flex items-center justify-between">
        <div className="flex items-center h-10">
          <Link
            href={organizationRoute({ slug: orgSlug ?? "" })}
            className="flex items-center space-x-2 text-lg tracking-tighter mr-8"
          >
            <span className="font-bold italic">CIBUM</span>
            <IconGrain size={18} />
          </Link>
          {orgSlug && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link
                    href={organizationDietsRoute({ slug: orgSlug })}
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Diets
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href={organizationConstraintsRoute({ slug: orgSlug })}
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Constraints
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href={organizationIngredientsRoute({ slug: orgSlug })}
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Ingredients
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href={organizationNutritionRoute({ slug: orgSlug })}
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Nutrients
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <OrganizationSwitcher
            hidePersonal
            afterLeaveOrganizationUrl="/app"
            afterCreateOrganizationUrl={(organization) =>
              organizationRoute({ slug: organization.slug ?? "" })
            }
            afterSelectOrganizationUrl={(organization) =>
              organizationRoute({ slug: organization.slug ?? "" })
            }
          />
          <UserButton />
        </div>
      </div>
    </div>
  );
}
