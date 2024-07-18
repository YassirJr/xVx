import img from '@/assets/images/onssa.webp'

export function getPhytosanitaryCertificate() {
  return `<div class="amiri-bold w-[406.46px] text-[8px]">
  <div class='h-[591.4175px] border border-black [&>*]:border-black grid grid-cols-4' >
  <div class="col-span-2 p-1 border-b border-r flex items-center justify-center">
    <img src="${img}" class="h-10" />
  </div>
  <div class="col-span-2 p-1 border-b flex justify-center items-center">
    <div class="text-center">
      <div>المملكة المغربية</div>
      <div class="uppercase">royaume du maroc</div>
    </div>
  </div>
  <div class="col-span-2 p-1 border-b border-r ">
    <div class="flex justify-between">
      <div>Nom et adresse de l'exportateur</div>
      <div>اسم وعنوان المصدر</div>
    </div>
    <div>company.name</div>
    <div>company.address</div>
  </div>
  <div class="col-span-2 p-1 border-b ">
    <div class="text-center">طلب شهادة الصحة النباتية</div>
    <div class="uppercase">Demande de certificat phytosanitaire</div>
    <div>N°</div>
  </div>
  <div class="col-span-2 p-1 border-b border-r ">
    <div class="flex justify-between">
      <div>Nom et adresse du destinataire</div>
      <div>اسم وعنوان المرسل إليه</div>
    </div>
    <div>destinataire.address</div>
  </div>
  <div class="col-span-2 p-1 border-b ">
    <div class="text-end">مصلحة وقاية النباتات ب</div>
    <div>Service de la protection des végétaux de :</div>
    <div></div>
  </div>

  <div class="col-span-2 border-b border-r ">
  <div class="p-1">
    <div class="flex justify-between p-1">
      <div>Moyen de transport</div>
      <div>وسيلة النقل</div>
    </div>
    <div class="m-4"></div>
  </div>
  <div class="p-1">
    <div class="p-1">Par camion</div>
    <div class="text-center font-bold p-1">6497-011</div>
  </div>
</div>
  <div class="col-span-2 border-b ">
    <div class="border-b border-black  p-1">
      <div class="flex justify-between p-1">
        <div>Date et lieu de l'expédition</div>
        <div>مکان و تاريخ الشحن</div>
      </div>
      <div class="flex justify-between p-1">
        <div>Station AKHSSASSI LAHOUSSINE</div>
        <div>10/01/2023</div>
      </div>
    </div>
    <div>
      <div class="flex justify-between p-1">
        <div>Point d'entrée</div>
        <div>نقطة الوصول</div>
      </div>
      <div class="text-center">Algesiras</div>
    </div>
  </div>
  <div class="col-span-2 p-1 border-b border-r text-center">
    <div>العدد الوزن العلامة ونوعية النباتات أو أجزاء النباتات</div>
    <div>Nombre, poids, marque et nature des végétaux ou parties des végétaux</div>
  </div>
  <div class="col-span-1 p-1 border-b border-r text-center">
    <div>مكان الزراعة</div>
    <div>Lieu de culture</div>
  </div>
  <div class="col-span-1 p-1 border-b text-center">
    <div>الكمية</div>
    <div>Quantité</div>
  </div>
  <div class="col-span-2 p-1 border-b border-r font-bold py-2">2380 OIGNON</div>
  <div class="col-span-1 p-1 border-b border-r text-center py-2">Chtouka Ait Baha</div>
  <div class="col-span-1 p-1 border-b text-center py-2">9 953 kgs</div>
  <div class="col-span-2 p-1 border-b border-r">
    <div class="p-1">
      <div class="text-end">النباتات المرسلة قد خضعت )أو لم تخضع( للمعالجة ضد الطفيليات</div>
      <div>Les végétaux expédiés ont (ou n'ont pas) subit un traitement antiparasitaire</div>
    </div>
    <div class="flex justify-between p-1">
      <div>Nature de ce traitement :</div>
      <div>نوعية هذه المعالجة</div>
    </div>
  </div>
    <div class="col-span-2 p-1">
      <div class="text-center">
        <div class='p-1'>A Agadir</div>
        <div class='p-1'>Le 10/01/2023</div>
      </div>
       <div class="pt-2">Signature de l'exportateur :</div>
    </div>
    <div class="col-span-2 p-1 border-r text-center">
      <div>طابع المخالصة 20 درهما</div>
      <div>Timbre de quittance à 20 DH</div>
      <div class="p-2"></div>
    </div>
  </div>
</div>
`
}
