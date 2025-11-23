import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="flex gap-5">
      <Card className="w-1/3">
      <CardHeader>
        <CardDescription>Total Revenue</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
        $1,250.00
        </CardTitle>
      </CardHeader>
      </Card>

      <Card className="w-1/3">
      <CardHeader>
        <CardDescription>New Customers</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
        1,234
        </CardTitle>
      </CardHeader>
      </Card>

      <Card className="w-1/3">
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            45,678
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
