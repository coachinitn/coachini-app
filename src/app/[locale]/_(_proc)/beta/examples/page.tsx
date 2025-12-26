import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/design-system/ui/base/tabs";
import CnUtilsExample from "@/design-system/ui/__examples__/CnUtilsExample";
import ResponsiveExample from "@/design-system/ui/__examples__/ResponsiveExample";
import TypographyExample from "@/design-system/ui/__examples__/TypographyExample";
import FluidTypographyExample from "@/design-system/ui/__examples__/FluidTypographyExample";
import FluidLineHeightExample from "@/design-system/ui/__examples__/FluidLineHeightExample";
import AliasesExample from "@/design-system/ui/__examples__/AliasesExample";

export default function ExamplesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="container py-8 px-4 mx-auto">
      <h1 className="mb-4 text-3xl font-bold">CN Utils Examples</h1>
      <p className="mb-8 text-lg text-gray-600">
        Explore the various utilities provided by the CN utils library.
      </p>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="responsive">Responsive</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="fluid">Fluid Typography</TabsTrigger>
          <TabsTrigger value="lineheight">Fluid Line Height</TabsTrigger>
          <TabsTrigger value="aliases">Aliases</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <CnUtilsExample />
        </TabsContent>

        <TabsContent value="responsive">
          <ResponsiveExample />
        </TabsContent>

        <TabsContent value="typography">
          <TypographyExample />
        </TabsContent>

        <TabsContent value="fluid">
          <FluidTypographyExample />
        </TabsContent>

        <TabsContent value="lineheight">
          <FluidLineHeightExample />
        </TabsContent>

        <TabsContent value="aliases">
          <AliasesExample />
        </TabsContent>
      </Tabs>
    </div>
  );
}
