import React, { useState } from 'react';
import { Phone, MapPin, Globe, Clock, ChevronDown, ChevronUp, Heart } from 'lucide-react';

const PusatBantuan = () => {
  const [expandedCard, setExpandedCard] = useState(null);

  const helpServices = [
    {
      id: 1,
      name: "Hotline 119",
      type: "Layanan Darurat 24/7",
      description: "Layanan kesehatan darurat nasional yang menyediakan konsultasi dan bantuan psikologis gratis 24 jam.",
      phone: "119",
      availability: "24 jam setiap hari",
      services: [
        "Konsultasi kesehatan mental darurat",
        "Rujukan ke fasilitas kesehatan terdekat",
        "Dukungan krisis psikologis"
      ],
      color: "bg-red-50 border-red-200"
    },
    {
      id: 2,
      name: "Into The Light Indonesia",
      type: "Hotline Pencegahan Bunuh Diri",
      description: "Organisasi nirlaba yang menyediakan dukungan emosional bagi individu yang mengalami krisis mental.",
      phone: "021-7256526 / 021-7257826 / 021-7221810",
      whatsapp: "08118001123",
      email: "intothelight@into-the-light.id",
      website: "https://into-the-light.id",
      availability: "Senin - Jumat: 09:00 - 17:00 WIB",
      services: [
        "Konseling krisis via telepon",
        "Dukungan emosional",
        "Pencegahan bunuh diri"
      ],
      color: "bg-blue-50 border-blue-200"
    },
    {
      id: 3,
      name: "Ikatan Psikolog Klinis (IPK) Indonesia",
      type: "Direktori Psikolog Profesional",
      description: "Organisasi profesi yang menyediakan direktori psikolog klinis tersertifikasi di seluruh Indonesia.",
      website: "https://ipkindonesia.or.id",
      email: "sekretariat@ipkindonesia.or.id",
      availability: "Cari psikolog terdekat di website",
      services: [
        "Direktori psikolog klinis bersertifikat",
        "Informasi layanan konseling profesional",
        "Verifikasi kredensial psikolog"
      ],
      color: "bg-purple-50 border-purple-200"
    },
    {
      id: 4,
      name: "Poli Jiwa Puskesmas",
      type: "Layanan Kesehatan Jiwa Primer",
      description: "Layanan kesehatan jiwa tingkat primer yang tersedia di Puskesmas seluruh Indonesia dengan biaya terjangkau atau gratis (BPJS).",
      phone: "Hubungi Puskesmas terdekat",
      availability: "Senin - Jumat: 08:00 - 14:00 (sesuai jam operasional Puskesmas)",
      services: [
        "Konsultasi kesehatan jiwa",
        "Pemeriksaan dan diagnosis awal",
        "Rujukan ke rumah sakit jiwa jika diperlukan",
        "Terapi dan obat-obatan dasar"
      ],
      info: "Dapat menggunakan BPJS Kesehatan",
      color: "bg-green-50 border-green-200"
    },
    {
      id: 5,
      name: "Sehat Jiwa (Kemenkes RI)",
      type: "Aplikasi Kesehatan Mental",
      description: "Aplikasi resmi Kementerian Kesehatan RI untuk screening mandiri dan informasi kesehatan jiwa.",
      website: "https://sehatjiwa.kemkes.go.id",
      availability: "Akses 24/7 melalui website atau aplikasi mobile",
      services: [
        "Self-assessment kesehatan mental",
        "Informasi dan edukasi kesehatan jiwa",
        "Pencarian fasilitas kesehatan jiwa terdekat"
      ],
      color: "bg-teal-50 border-teal-200"
    }
  ];

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pusat Bantuan</h1>
              <p className="text-sm text-gray-600">Informasi Layanan Kesehatan Mental</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Anda Tidak Sendiri
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Kesehatan mental sama pentingnya dengan kesehatan fisik. Jika Anda atau orang terdekat membutuhkan bantuan, berikut adalah layanan profesional yang dapat dihubungi.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-sm text-yellow-800 font-medium">
              ⚠️ <strong>Dalam kondisi darurat</strong>, segera hubungi Hotline 119 atau kunjungi Unit Gawat Darurat (UGD) rumah sakit terdekat.
            </p>
          </div>
        </div>

        {/* Help Services Cards */}
        <div className="space-y-4">
          {helpServices.map((service) => (
            <div
              key={service.id}
              className={`${service.color} border-2 rounded-lg shadow-md overflow-hidden transition-all duration-300`}
            >
              {/* Card Header */}
              <button
                onClick={() => toggleCard(service.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-opacity-80 transition-colors"
              >
                <div className="text-left flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{service.type}</p>
                </div>
                {expandedCard === service.id ? (
                  <ChevronUp className="w-6 h-6 text-gray-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-600 flex-shrink-0" />
                )}
              </button>

              {/* Card Content */}
              {expandedCard === service.id && (
                <div className="px-6 pb-6 space-y-4 bg-white bg-opacity-50">
                  <p className="text-gray-700">{service.description}</p>

                  {/* Contact Information */}
                  <div className="space-y-3">
                    {service.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Telepon</p>
                          <a href={`tel:${service.phone}`} className="text-blue-600 hover:underline">
                            {service.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {service.whatsapp && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">WhatsApp</p>
                          <a href={`https://wa.me/${service.whatsapp.replace(/\D/g, '')}`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                            {service.whatsapp}
                          </a>
                        </div>
                      </div>
                    )}

                    {service.email && (
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Email</p>
                          <a href={`mailto:${service.email}`} className="text-blue-600 hover:underline">
                            {service.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {service.website && (
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Website</p>
                          <a href={service.website} className="text-blue-600 hover:underline break-all" target="_blank" rel="noopener noreferrer">
                            {service.website}
                          </a>
                        </div>
                      </div>
                    )}

                    {service.availability && (
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Jam Operasional</p>
                          <p className="text-gray-700">{service.availability}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Services Offered */}
                  <div>
                    <p className="font-medium text-gray-900 mb-2">Layanan yang Tersedia:</p>
                    <ul className="space-y-1">
                      {service.services.map((item, idx) => (
                        <li key={idx} className="text-gray-700 flex items-start gap-2">
                          <span className="text-purple-600 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {service.info && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <p className="text-sm text-blue-800">
                        ℹ️ {service.info}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Catatan Penting</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">•</span>
              <span>Semua layanan di atas adalah layanan profesional yang terverifikasi</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">•</span>
              <span>Jangan ragu untuk mencari bantuan - meminta bantuan adalah tanda kekuatan, bukan kelemahan</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">•</span>
              <span>Informasi kontak diperbarui per Oktober 2024. Silakan verifikasi jika ada perubahan</span>
            </li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>Pusat Bantuan - Kesehatan Mental untuk Semua</p>
          <p className="mt-2">Ingat: Anda tidak pernah sendirian dalam perjalanan ini</p>
        </div>
      </footer>
    </div>
  );
};

export default PusatBantuan;