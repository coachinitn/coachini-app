"use client";

import { useParams } from "next/navigation";
import { useRouter, usePathname } from "@/core/i18n/navigation";
import { Button } from "@/design-system/ui/base/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/design-system/ui/base/dropdown-menu";
import { siteConfig } from "@/core/config/siteConfig";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  // Get current locale from URL params
  const currentLanguage = (params?.locale as string) || siteConfig.defaultLocale;

    router.replace(pathname, { locale: newLanguage });
  };

  const languageLabels = {
    en: "English",
    fr: "Français",
  };

  return (
    <DropdownMenu dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {languageLabels[currentLanguage as keyof typeof languageLabels]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("en")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("fr")}>
          Français
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
