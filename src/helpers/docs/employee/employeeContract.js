import dayjs from 'dayjs'

export function getEmployeeContract(employee, company, lastIndex) {
  const { firstname, lastname, uid, birth_date, address, cin, type, contract_date } = employee
  const current_format = 'DD-MM-YYYY'
  const arabic_format = 'YYYY-MM-DD'
  return `<div
    dir="rtl"
    class="amiri-bold w-[406.46px] ${
      lastIndex ? 'h-[590px]' : 'h-[591.4175px]'
    } p-2 bg-white text-right text-[9px] border border-black"
  >
    <div class="pr-10">${uid}</div>
    <div class="text-center underline font-extrabold">${company.name}</div>
    <div class="text-center w-28 m-auto text-sm" style="font-weight: bold;">عقد الشغل موسمي</div>
    <div>الطرف الأول<span dir="ltr">:</span></div>
    <p class="indent-8">
      شركة <span>${company.name}</span> <span dir="ltr">،</span> والكائن مقرها الإجتماعي
      <span>${
        company.address
      }</span> <span dir="ltr">،</span>ورقم انخراطها بالصندوق الوطني للضمان الإجتماعي رقم
      ، ${type.cnss_affiliation} المؤمنة على حوادث الشغل والأمراض المهنية لدى شركة
      <span>${company?.work_accident_insurance}</span>.
    </p>
    <div>الطرف الثاني<span dir="ltr">:</span></div>
    <p class="indent-8">
      السيد<span dir="ltr"> :(ة)</span><span>${firstname} ${lastname}</span> البطاقة الوطنية رقم<span dir="ltr"> :</span> <span>${cin} </span>المزداد <span dir="ltr"> :(ة)</span><span>${dayjs(
        birth_date,
        current_format,
      ).format(arabic_format)}</span> القاطن <span dir="ltr"> :(ة)</span> ب : ${address}
    </p>
    <div>مقدمة<span dir="ltr">:</span></div>
    <p class="indent-8"> نظرا للطبيعة الموسمية لعمل الشركة والمتعلق بطريقة مباشرة بموسم زراعة وحصاد الخضراوات<span dir="ltr">.</span></p>
    <p>وعملا بالمادة 16 من قانون الشغل المغربي<span dir="ltr">،</span> اتفق الطرفان على ما يلي<span dir="ltr">:</span></p>
    <div class="underline">المادة 1:</div>
    <p class="indent-8">
      يتم تشغيل السيد<span dir="ltr"> :(ة)</span> <span>${firstname} ${lastname}</span> كعامل<span dir="ltr"> (ة)</span> موسمي<span dir="ltr"> (ة)</span> بعقد عمل موسمي
حسب متطلبات العمل المتعلقة بالنشاط الفلاحي المذكور مسبقا<span dir="ltr">.</span>
    </p>
    <div class="underline">المادة 2:</div>
    <p class="indent-8">
      تم الاتفاق بين الطرفين على المدة  المحدودة للعقد والتي تمتد من ${dayjs(
        contract_date,
        current_format,
      ).format(arabic_format)}
الى نهاية الموسم والذي ينتهي تدريجيا حسب حاجيات الشركة من اليد العاملة<span dir="ltr">.</span>
    </p>
    <p>
      كما يمكن فسخ هذا العقد قبل حلول آجله دون المطالبة بأي تعويض في الحالات
      التالية :
    </p>
    <ul class='pr-4'>
      <li>إرتكاب خطأ جسيم<span dir="ltr">.</span></li>
      <li>القوة القاهرة أو الحادث المفاجئ<span dir="ltr">.</span></li>
      <li>نهاية الموسم الفلاحي لسبب طبيعي أو انخفاض وثيرة العمل لسبب ما<span dir="ltr">.</span></li>
      <li>عدم احترام القانون الداخلي<span dir="ltr">.</span></li>
      <li>عدم احترام النصوص التشريعية والتنظيمية في مجال السلامة وحفظ الصحة<span dir="ltr">.</span></li>
    </ul>
    <div class="underline">المادة 3:</div>
    <p class="indent-8">
      يخضع الأجير لمدة تجربة تحدد في 15 يوما قابلة للتجديد مرة واحدة يمكن
      خلالها فسخ العقدة دون أي تعويض<span dir="ltr">.</span>
    </p>
    <div class="underline">المادة 4:</div>
    <p class="indent-8">
      يتم تشغيل الأجير مقابل أجر محدد في الحد الأدنى للأجر المعمول به في نفس
      المدة<span dir="ltr">،</span> على أساس ${type.nbr_hours} ساعات عادية طبقا للتوزيع السنوي لساعات
      العمل العادية<span dir="ltr">،</span> ويمكن كذلك العمل بالأجرة بالقطعة<span dir="ltr">.</span>
    </p>
    <div class="underline">المادة 5:</div>
    <p class="indent-8">
      يلتزم الأجير بالتحلي بالسلوك القويم وبالمحافظة على الأشياء التي تسلم
      إليه من طرف الشركة وعدم تعريضها للهلاك<span dir="ltr">.</span>
    </p>
    <div class="underline">المادة 6:</div>
    <p class="indent-8">
      يعتبر العنوان المدلى والمشار إليه أعلاه عنوان مراسلة الأجير بصفة
      قانونية<span dir="ltr">،</span> في حالة تغييره يجب إخبار مصلحة الموارد البشرية في الشركة<span dir="ltr">،</span>
      وإلااعتبر مسؤولا على النتائج المترتبة عن ذلك<span dir="ltr">.</span>
    </p>
    <div class="underline">المادة 7:</div>
    <p class="indent-8">
      هذا العقد تم إعداده في نسختين أصليتين يتم إرجاع واحدة مصادق عليها إلى
      الشركة<span dir="ltr">.</span>
    </p>
    <p>حرر باكادير<span dir="ltr">،</span> يوم<span dir="ltr"> :</span><span class="px-1">${dayjs(
      contract_date,
      current_format,
    ).format(arabic_format)}</span></p>
    <div class="grid grid-cols-2 px-8 py-2">
      <div class="col-span-1">
        <div class="h-8" >العامل<span dir="ltr"> :(ة)</span></div>
        <div>............................................</div>
      </div>
      <div class="col-span-1 text-left">
        <div class="h-8" style="font-weight: 800;">${company.name}</div>
        <div>............................................</div>
      </div>
    </div>
  </div>`
}
