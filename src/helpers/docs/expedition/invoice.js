export const getInvoice = () => {
  let tbody = ''
  const products = [
    {
      name: 'Citrus',
      packaging: '10',
      boxes: '10',
      netWeight: '10',
      grossWeight: '10',
      price: '10',
    },
    {
      name: 'Citrus',
      packaging: '10',
      boxes: '10',
      netWeight: '10',
      grossWeight: '10',
      price: '10',
    },
    {
      name: 'Citrus',
      packaging: '10',
      boxes: '10',
      netWeight: '10',
      grossWeight: '10',
      price: '10',
    },
  ]

  products.map(
    (product) =>
      (tbody += `<tr class="border-b border-x border-black [&>*]:border-black [&>*]:p-1">
      <th class="border-r">${product.name} </th>
      <td class="border-r">${product.packaging}</td>
      <td class="border-r">${product.boxes}</td>
      <td class="border-r">${product.netWeight}</td>
      <td class="border-r">${product.grossWeight}</td>
      <td>${product.price}</td></tr>`),
  )

  return `<div class="amiri-bold w-[406.26px] text-[8px]">
  <div class="relative h-[591.4175px] w-full flex flex-col gap-2">
  <div class="w-2/5 flex flex-col justify-between">
    <span class="font-bold">QUALITY CITRUS MAROCCO</span>
    <span>Imm. Tafraout ne H8_28</span>
    <span>Bensergao Founty</span>
    <span>Agadir</span>
  </div>
  <div class="w-1/5 flex flex-col self-center justify-between">
    <span class="font-bold">Quality Fruit BV</span>
    <span>Markt 5</span>
    <span>4724 BK Wouw</span>
    <span>The Netherlands</span>
  </div>
  <div class="flex flex-col justify-between">
    <div class="flex">
      <span class="w-20">Facture N°</span>
      <span class="font-bold">MA2223211</span>
    </div>
    <div class="flex">
      <span class="w-20">Date</span>
      <span class="font-bold">10/01/2023</span>
    </div>
    <div class="flex mt-2">
      <span class="w-20">Truck number</span>
      <span class="font-bold">6497-011</span>
    </div>
    <div class="flex">
      <span class="w-20">Transporteur</span>
      <span class="font-bold">INTER FIVE</span>
    </div>
  </div>
  <table class="w-full mt-4 text-center text-[7px] [&>*]:border-black">
    <thead class="uppercase border bg-gray-100">
        <tr class="[&>*]:border-black [&>*]:border-r [&>*]:p-1">
          <th scope="col">PRODUIT</th>
          <th scope="col">Emballage</th>
          <th scope="col">BOXES</th>
          <th scope="col">POIDS NET</th>
          <th scope="col">POIDS Brut</th>
          <th scope="col">PRIX</th>
        </tr>
    </thead>
    <tbody class="border-x border-b">${tbody}</tbody>
    <tfoot class="uppercase">
      <tr class="[&>*]:border-black [&>*]:p-1">
        <th scope="col" class="text-left">Total palettes :</th>
        <th scope="col" class="text-left border-r">26</th>
        <th scope="col" class="border-r border-b "></th>
        <th scope="col" class="border-r border-b "></th>
        <th scope="col" class="border-r border-b "></th>
        <th scope="col" class="border-r border-b "></th>
      </tr>
      <tr class="[&>*]:text-left [&>*]:p-1">
          <th scope="col">Expédition :</th>
          <th scope="col">FOB</th>
      </tr>
    </tfoot>
  </table>
  <div class="absolute bottom-0">
    ALITY CIRUS MAROCCO SARL au capital de : 2 6000 000,00 - RC:32075 - Patente : 5504657118767210 </br>
    ICE : 000285761000027 Compte bancaire 007010 0001845000002653 96 Tél:(212) 05 28 23 55 83
  </div>
</div>
</div>`
}
