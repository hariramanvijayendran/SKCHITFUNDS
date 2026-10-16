import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useLang } from '../context/LangContext'
import { copy } from '../data/copy'

export default function FaqPage() {
  const { lang } = useLang()
  const t = copy[lang]
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqs: [string, string][] = lang === 'en' ? [
    ['How are chit funds regulated in India and Tamil Nadu?', 'All chit schemes operated by Velu Senthilkumar Chit Funds Private Limited comply strictly with the central Chit Funds Act, 1982 and the Tamil Nadu Chit Funds Rules. Each scheme group is registered with the Chit Registrar before commencing subscriber enrolments.'],
    ['How is the monthly chit auction prize winner determined?', 'In every monthly auction, participating subscribers who require funds submit competitive discount bids up to the statutory ceiling. The subscriber offering the highest auction discount receives the prized sum. In months with multiple ceiling bids or standard draws, the statutory draw procedure is conducted openly.'],
    ['What happens to the auction discount (dividend)?', 'After deducting the statutory foreman commission (regulated under the Act), the entire remaining auction discount is distributed equally among all non-prized subscribers as dividend. This dividend directly reduces your next month’s instalment amount.'],
    ['What security or documentation is required to withdraw prized money?', 'Prized subscribers must furnish standard surety/security documentation as mandated by statutory guidelines and the approved chit agreement to ensure mutual protection for all group members throughout the remaining tenure.'],
    ['Can I enrol in multiple schemes simultaneously?', 'Yes. Subscribers frequently pair different scheme durations — for example, a 10-month quick liquidity scheme alongside a 25 or 40-month systematic milestone savings scheme.'],
    ['Where can I verify your corporate credentials?', 'You can verify our corporate credentials directly with the Ministry of Corporate Affairs using CIN: U64990TZ2024PTC033243, or visit our registered and administrative offices in Salem.'],
  ] : [
    ['சிட் ஃபண்ட்ஸ் எவ்வாறு முறைப்படுத்தப்படுகிறது?', 'வேலு செந்தில்குமார் சிட் ஃபண்ட்ஸ் பிரைவேட் லிமிடெட் நடத்தும் அனைத்து திட்டங்களும் மத்திய சிட் ஃபண்ட்ஸ் சட்டம் 1982 மற்றும் தமிழ்நாடு சிட் ஃபண்ட்ஸ் விதிகளுக்கு உட்பட்டு பதிவு செய்யப்படுகின்றன. ஒவ்வொரு குழுவும் அரசு பதிவாளரிடம் முன்-அனுமதி பெற்ற பின்னரே தொடங்கப்படுகிறது.'],
    ['மாதாந்திர ஏல பரிசுத்தொகை எவ்வாறு வழங்கப்படுகிறது?', 'ஒவ்வொரு மாதமும் நிதி தேவைப்படும் சந்தாதாரர்கள் ஏலத்தில் பங்கேற்று கழிவுத் தொகையைக் குறிப்பிடுகிறார்கள். சட்டப்பூர்வ வரம்பிற்குள் அதிகபட்ச தள்ளுபடி கோருபவருக்கு பரிசுத் தொகை விடுவிக்கப்படும்.'],
    ['ஏலத் தள்ளுபடி (டிவிடெண்ட்) யாருக்குச் செல்லும்?', 'நிறுவனக் கட்டணம் கழித்த பிறகு மீதமுள்ள முழு ஏலக் கழிவும் ஏலம் எடுக்காத அனைத்து சந்தாதாரர்களுக்கும் சமமாகப் பகிர்ந்து வழங்கப்பட்டு அவர்களின் அடுத்த மாதத் தவணையில் கழிக்கப்படும்.'],
    ['பரிசுத் தொகையைப் பெற என்ன ஆவணங்கள் தேவை?', 'குழுவின் அனைத்து சந்தாதாரர்களின் நிதிப் பாதுகாப்பை உறுதிசெய்ய, பரிசுத் தொகை பெறுபவர் சட்ட விதிகளின்படி தேவையான பிணை ஆவணங்களை வழங்க வேண்டும்.'],
  ]

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-6 bg-cream">
      <div className="mx-auto max-w-3xl space-y-12">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black text-deep tracking-tight">
            {t.faqTitle}
          </h1>
          <p className="text-base text-charcoal/70 leading-relaxed font-medium">
            {t.faqLead}
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map(([q, a], i) => (
            <div key={q} className="rounded-2xl bg-white overflow-hidden">
              <button
                type="button"
                className="flex min-h-16 w-full items-center justify-between gap-4 px-6 text-left font-bold text-deep text-sm sm:text-base"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
              >
                <span>{q}</span>
                {openFaq === i ? (
                  <ChevronUp className="shrink-0 text-brand" size={19} />
                ) : (
                  <ChevronDown className="shrink-0 text-charcoal/40" size={19} />
                )}
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6 pt-1 text-sm text-charcoal/80 leading-relaxed">
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

