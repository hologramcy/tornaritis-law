import { useState } from 'react';
import { Mail, MapPin, Phone, Clock, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader } from '@/components/PageHeader';

export function ContactPage() {
  const [formType, setFormType] = useState<'contact' | 'appointment'>('contact');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      if (formType === 'appointment') {
        const { error } = await supabase.from('appointments').insert({
          name: `${firstName} ${lastName}`,
          email,
          phone,
          preferred_date: preferredDate || null,
          message,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.from('form_submissions').insert({
          form_type: 'contact',
          name: `${firstName} ${lastName}`,
          email,
          phone,
          message,
        });
        if (error) throw error;
      }
      setStatus('success');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setPreferredDate('');
    } catch {
      setStatus('error');
    }
  };

  const contactInfo = [
    { icon: MapPin, label: 'Nicosia', value: '16 Stasikratous, 1065 Nicosia, Cyprus' },
    { icon: Mail, label: 'Email', value: 'office@tornaritislaw.com', href: 'mailto:office@tornaritislaw.com' },
    { icon: Phone, label: 'Phone', value: '+357 22 456 056' },
    { icon: Clock, label: 'Hours', value: 'Monday – Thursday 08:30 – 13:00 & 14:00 – 17:30; Friday 08:30 – 14:00' },
  ];

  return (
    <main>
      <PageHeader badge="Start a conversation" title="Contact us">
        <p>Tell us where you want to go. We will help you find the clearest way there.</p>
      </PageHeader>

      <section className="px-6 py-20 lg:px-12">
        <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-[.85fr_1.15fr]">
        {/* Contact info */}
        <div>
          <p className="eyebrow">Our offices</p>
          <h2 className="mt-5 font-serif text-4xl text-[#273237]">Let's talk.</h2>
          <p className="mt-4 text-sm leading-6 text-[#687277]">
            Reach us by phone, email, or the form opposite. We respond to all enquiries within one business day.
          </p>

          <div className="mt-10 space-y-5">
            {contactInfo.map((info) => (
              <div key={info.label} className="flex items-start gap-4 rounded-xl border border-[#e7e9ea] bg-white p-4 transition-colors hover:border-[#b90046]/30">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fdf0f5]">
                  <info.icon size={18} className="text-[#b90046]" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#879195]">{info.label}</p>
                  {info.href ? (
                    <a href={info.href} className="mt-1 block text-sm text-[#273237] transition-colors hover:text-[#b90046]">{info.value}</a>
                  ) : (
                    <p className="mt-1 text-sm text-[#273237]">{info.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-[#e7e9ea] bg-white p-8 lg:p-10">
          <div className="mb-8 flex gap-2 rounded-lg bg-[#f0f3f3] p-1">
            <button
              onClick={() => setFormType('contact')}
              className={`flex-1 rounded-md px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] transition-all ${
                formType === 'contact' ? 'bg-white text-[#b90046] shadow-sm' : 'text-[#687277]'
              }`}
            >
              Send a message
            </button>
            <button
              onClick={() => setFormType('appointment')}
              className={`flex-1 rounded-md px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] transition-all ${
                formType === 'appointment' ? 'bg-white text-[#b90046] shadow-sm' : 'text-[#687277]'
              }`}
            >
              Book an appointment
            </button>
          </div>

          {status === 'success' && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700 animate-scale-in">
              <CheckCircle2 size={18} className="shrink-0" />
              Thank you for reaching out. We will get back to you shortly.
            </div>
          )}
          {status === 'error' && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              Something went wrong. Please try again or email us directly.
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">
                First name
                <input
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input-modern mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-4 py-3 text-base font-normal outline-none"
                />
              </label>
              <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">
                Last name
                <input
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input-modern mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-4 py-3 text-base font-normal outline-none"
                />
              </label>
            </div>

            <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">
              Email address
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-modern mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-4 py-3 text-base font-normal outline-none"
              />
            </label>

            <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">
              Phone
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-modern mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-4 py-3 text-base font-normal outline-none"
              />
            </label>

            {formType === 'appointment' && (
              <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">
                Preferred date
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="input-modern mt-2 block w-full rounded-lg border border-[#d9ddde] bg-white px-4 py-3 text-base font-normal outline-none"
                />
              </label>
            )}

            <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#536066]">
              {formType === 'appointment' ? 'How can we help?' : 'Your message'}
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input-modern mt-2 block w-full resize-none rounded-lg border border-[#d9ddde] bg-white px-4 py-3 text-base font-normal outline-none"
              />
            </label>

            <button
              className="btn-shine flex w-full items-center justify-center gap-2 rounded-lg bg-[#b90046] px-7 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-[#930038] hover:shadow-lg hover:shadow-[#b90046]/20 disabled:opacity-50"
              type="submit"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Sending...' : formType === 'appointment' ? 'Request appointment' : 'Send enquiry'}
            </button>
          </form>
        </div>
        </div>
      </section>
    </main>
  );
}
