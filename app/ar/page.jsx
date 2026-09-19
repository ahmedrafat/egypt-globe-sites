/**
 * /ar — Arabic company profile for Egypt Globe Group.
 *
 * Why it exists (Sep 2026): Search Console shows Arabic brand queries —
 * "شركة جلوب", "جلوبال ايجيبت", "شركه جلوب", "كود ميناء دمياط" — landing on
 * English pages at positions 3–8 with zero clicks. Egyptian partners, banks,
 * forwarders and suppliers search the company name in Arabic; this page
 * answers that intent with a profile, the divisions, the ports and contact
 * details, and hands off to the English catalogue and the RFQ desk.
 *
 * Every figure is the published English copy (about, export record, ports,
 * hubs) — nothing is translated from a number the site does not carry.
 * Site chrome stays English (same pattern as saltsiwa.com/de).
 */
import Link from 'next/link'
import HeroMotif from '../../components/HeroMotif'
import Icon from '../../components/ui/Icon'
import { getSiteSettings } from '../../lib/corporatePages'

export const dynamic = 'force-dynamic'

const BASE = 'https://egyptglobe.com'
const TITLE = 'مجموعة إيجيبت جلوب — تصدير السلع الأساسية من مصر بالجملة'
const DESCRIPTION = 'مجموعة إيجيبت جلوب: مصدّر مصري للملح والأسمنت والأسمدة والكيماويات والمعادن ومواد البناء والمنتجات الزراعية من 7 موانئ مصرية، مع شهادة تحليل لكل شحنة قبل بوليصة الشحن.'

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: {
    canonical: `${BASE}/ar`,
    languages: { en: `${BASE}/`, ar: `${BASE}/ar`, 'x-default': `${BASE}/` },
  },
  openGraph: {
    type: 'website', title: TITLE, description: DESCRIPTION, url: `${BASE}/ar`,
    siteName: 'Egypt Globe Group', locale: 'ar_EG',
    images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630, alt: 'Egypt Globe Group' }],
  },
}

const DIVISIONS = [
  { href: '/products/salt',         ar: 'الملح',                   en: 'Salt',              note: 'ملح صخري من سيوة والقطارة وملح بحري من شمال سيناء والبحر الأحمر — درجات صناعية وغذائية وإذابة الثلوج' },
  { href: '/products/construction', ar: 'الأسمنت ومواد البناء',    en: 'Cement & construction', note: 'أسمنت بورتلاندي وكلنكر وجبس ورخام وجرانيت وحجر جيري' },
  { href: '/products/fertilizers',  ar: 'الأسمدة',                 en: 'Fertilizers',       note: 'يوريا ونترات الأمونيوم وسماد مركّب وفوسفات وكبريت' },
  { href: '/products/chemicals',    ar: 'الكيماويات',              en: 'Chemicals',         note: 'صودا كاوية وكيماويات معالجة المياه والمذيبات والأحماض' },
  { href: '/products/minerals',     ar: 'المعادن الصناعية',        en: 'Industrial minerals', note: 'رمل السيليكا والباريت والكاولين والفلسبار والتلك وخام الحديد' },
  { href: '/products/metals',       ar: 'المعادن والسبائك',        en: 'Metals & alloys',   note: 'حديد التسليح ولفائف الصلب والسبائك الحديدية' },
  { href: '/products/agro',         ar: 'المنتجات الزراعية',       en: 'Agro',              note: 'حبوب وبقوليات وتمور وزيوت وسكر وتوابل' },
]

const PORTS = [
  ['الإسكندرية', 'Alexandria', 'EGALY', '/ports/alexandria-salt'],
  ['الدخيلة', 'El Dekheila', 'EGEDK', '/ports/el-dekheila-salt'],
  ['دمياط', 'Damietta', 'EGDAM', '/ports/damietta-salt'],
  ['شرق بورسعيد', 'Port Said East', 'EGPSE', '/ports/port-said-east-salt'],
  ['العريش', 'Al-Arish', 'EGAAC', '/ports/al-arish-salt'],
  ['العين السخنة', 'Ain Sokhna', 'EGSOK', '/ports/ain-sokhna-salt'],
  ['سفاجا', 'Safaga', 'EGSGA', '/ports/safaga-salt'],
]

const AR_FONT = { fontFamily: "'Segoe UI', Tahoma, 'Noto Naskh Arabic', 'Noto Sans Arabic', Arial, sans-serif" }

export default async function ArabicProfile() {
  const s = await getSiteSettings()
  const email = s?.email || 'export@egyptglobe.com'
  const phone = s?.phone || '+20 100 772 9844'
  const phoneE164 = s?.phoneE164 || '+201007729844'
  const whatsapp = s?.whatsappUrl || `https://wa.me/${phoneE164.replace(/[^0-9]/g, '')}`

  return (
    <article lang="ar" dir="rtl" className="bg-white text-[#14161a]" style={AR_FONT}>
      <section className="relative overflow-hidden bg-white border-b border-[#14161a]/10">
        <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-70 pointer-events-none" />
        <HeroMotif variant="compass" tone="#0fb5a5" />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(55% 55% at 12% 0%, rgba(15,181,165,.2), transparent 60%), radial-gradient(40% 45% at 100% 100%, rgba(255,99,33,.09), transparent 60%)' }} />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16">
          <nav className="flex items-center gap-2 text-xs text-[#5b6577] mb-5 flex-wrap">
            <Link href="/" className="hover:text-[#14161a] transition-colors">الرئيسية (English)</Link>
            <span>‹</span>
            <span className="text-[#14161a] font-medium">عن المجموعة بالعربية</span>
          </nav>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="egg-chip text-xs">تأسست 2014 · القاهرة ودمياط الجديدة</span>
            <span className="egg-chip text-xs">7 موانئ تصدير مصرية</span>
            <span className="egg-chip text-xs">شهادة تحليل قبل بوليصة الشحن</span>
          </div>
          <h1 className="egg-display text-4xl sm:text-5xl lg:text-6xl text-[#14161a] mb-4 leading-[1.15]">
            مجموعة إيجيبت جلوب — تصدير السلع الأساسية من مصر
          </h1>
          <p className="text-base sm:text-lg leading-loose max-w-3xl text-[#3f4650]">
            مجموعة تصدير وخدمات لوجستية مصرية تعمل منذ عام 2014، بمقر رئيسي في مدينة نصر بالقاهرة ومكتب عمليات في
            دمياط الجديدة وفرق دائمة في موانئ التصدير. تُختبر كل دفعة في معمل الميناء قبل الشحن، وتصدر شهادة التحليل
            قبل بوليصة الشحن، وتُرفض في ميناء التحميل أي دفعة خارج المواصفة التعاقدية.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/rfq" className="egg-btn-primary">اطلب عرض سعر</Link>
            <Link href="/products" className="egg-btn-ghost">الكتالوج الكامل (English)</Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="egg-display text-2xl sm:text-3xl mb-2">سجل التصدير</h2>
        <p className="text-[#3f4650] leading-loose max-w-3xl mb-8">
          صدّرت المجموعة أكثر من مليوني طن من الملح المصري منذ عام 2015 على متن أكثر من 100 سفينة مستأجرة، إلى جانب
          الأسمنت والأسمدة والمعادن ومواد البناء إلى أكثر من 60 سوقًا. التفاصيل الكاملة في صفحة{' '}
          <Link href="/about/export-record" className="egg-link">سجل التصدير</Link>.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[['+2 مليون طن', 'ملح مصدّر منذ 2015'], ['+100', 'سفينة مستأجرة'], ['7', 'موانئ تحميل مصرية'], ['+60', 'سوق تصدير']].map(([v, l]) => (
            <div key={l} className="egg-card p-5">
              <div className="text-2xl sm:text-3xl font-bold text-[#14161a]">{v}</div>
              <div className="text-sm text-[#5b6577] mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <h2 className="egg-display text-2xl sm:text-3xl mb-6">أقسام المجموعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DIVISIONS.map(d => (
            <Link key={d.href} href={d.href} className="egg-card p-5 block hover:shadow-md transition-shadow">
              <div className="font-bold text-lg text-[#14161a]">{d.ar}</div>
              <div className="text-xs text-[#5b6577] mb-2" dir="ltr">{d.en}</div>
              <p className="text-sm text-[#3f4650] leading-relaxed">{d.note}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <h2 className="egg-display text-2xl sm:text-3xl mb-2">موانئ التحميل</h2>
        <p className="text-[#3f4650] leading-loose max-w-3xl mb-6">
          يُحمَّل الملح الصخري من الدخيلة والإسكندرية ودمياط والعين السخنة، والملح البحري من العريش وشرق بورسعيد ودمياط
          والعين السخنة؛ وتخدم سفاجا شحنات الفوسفات والمعادن من البحر الأحمر. الشحن بشروط FOB أو CFR أو CIF.
        </p>
        <div className="overflow-x-auto egg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-xs uppercase tracking-wider text-[#5b6577]">
                <th className="px-4 py-3">الميناء</th><th className="px-4 py-3" dir="ltr">Port</th><th className="px-4 py-3" dir="ltr">UN/LOCODE</th>
              </tr>
            </thead>
            <tbody>
              {PORTS.map(([ar, en, code, href]) => (
                <tr key={code} className="border-t border-[#14161a]/10">
                  <td className="px-4 py-3 font-medium">{ar}</td>
                  <td className="px-4 py-3" dir="ltr"><Link href={href} className="egg-link">{en}</Link></td>
                  <td className="px-4 py-3 font-mono" dir="ltr">{code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <h2 className="egg-display text-2xl sm:text-3xl mb-6">ضمان الجودة والمستندات</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            ['اختبار كل دفعة', 'تحليل كامل في معمل الميناء (النقاء والرطوبة والشوائب والتدرج الحبيبي) وفق المواصفة التعاقدية، وشهادة التحليل تصدر قبل بوليصة الشحن.'],
            ['فحص مستقل عند الطلب', 'معاينة قبل الشحن من TÜV Austria أو SGS أو Intertek أو Bureau Veritas مع سحب عينات محفوظة لمدة 90 يومًا.'],
            ['مجموعة مستندات الاعتماد', 'فاتورة تجارية، قائمة تعبئة، بوليصة شحن، شهادة منشأ (EUR.1 / PAFTA / COMESA / AfCFTA)، شهادة تحليل، وشهادات الحلال أو ISO 22000 للدرجات الغذائية.'],
          ].map(([h, b]) => (
            <div key={h} className="egg-card p-5">
              <div className="flex items-center gap-2 mb-2"><Icon name="shield" className="w-4 h-4 text-[#087a70]" /><span className="font-bold">{h}</span></div>
              <p className="text-sm text-[#3f4650] leading-relaxed">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-16">
        <div className="egg-panel egg-grid-light rounded-2xl p-6 sm:p-10">
          <h2 className="egg-display text-2xl sm:text-3xl mb-4">تواصل معنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#3f4650] leading-loose">
            <div>
              <p><span className="font-bold text-[#14161a]">المقر الرئيسي:</span> 30 شارع سيبويه المصري، متفرع من شارع الطيران، مدينة نصر، القاهرة</p>
              <p><span className="font-bold text-[#14161a]">مكتب العمليات:</span> مكتب 2، عمارة 82، الحي المركزي، دمياط الجديدة</p>
              <p><span className="font-bold text-[#14161a]">سجل تجاري:</span> <span dir="ltr">{s?.commercialRegistry || '73418'}</span> · <span className="font-bold text-[#14161a]">رخصة تصدير:</span> <span dir="ltr">{s?.exportLicense || '600010794'}</span></p>
            </div>
            <div>
              <p><span className="font-bold text-[#14161a]">البريد الإلكتروني:</span> <a href={`mailto:${email}`} className="egg-link" dir="ltr">{email}</a></p>
              <p><span className="font-bold text-[#14161a]">الهاتف / واتساب:</span> <a href={`tel:${phoneE164}`} className="egg-link" dir="ltr">{phone}</a> · <a href={whatsapp} className="egg-link" target="_blank" rel="noopener noreferrer">WhatsApp</a></p>
              <p className="mt-3"><Link href="/rfq" className="egg-btn-primary">أرسل طلب عرض سعر</Link></p>
            </div>
          </div>
          <p className="text-xs text-[#5b6577] mt-6" dir="ltr">
            This page is the Arabic company profile. Product specifications, standards and prices are published in English —{' '}
            <Link href="/" className="egg-link">egyptglobe.com</Link>.
          </p>
        </div>
      </section>
    </article>
  )
}
