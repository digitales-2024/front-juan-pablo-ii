import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, type TabsContentProps } from "@radix-ui/react-tabs";
import React from "react";
interface FilterStockTabCardContentProps extends TabsContentProps {
    
}

const TAB_OPTIONS = {
  BY_PRODUCT: { value: "by_product" }
};

export function FilterStockTabCardContent() {
  return (
    <TabsContent value={TAB_OPTIONS.BY_PRODUCT.value}>
      <Card>
        <CardHeader className="space-y-4">
          <CardTitle className="block text-center">Password</CardTitle>
          <CardDescription>
            Change your password here. After saving, you'll be logged out.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* <Form {...filterByProductForm}>
            <form
              onSubmit={filterByProductForm.handleSubmit(
                handleFilterByProductSubmit
              )}
              className="space-y-4 flex flex-col items-center"
            >
              <FormField
                control={filterByProductForm.control}
                name="productId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <SearchProductCombobox
                      onValueChange={(val) => {
                        field.onChange(val);
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <Button type="submit" className="w-full">
                Aplicar
              </Button>
            </form>
          </Form> */}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
