// All wedding content lives here — edit this file to change text, times, venues or photos.

export const couple = {
  groom: 'Srinivas Teja', groomTe: 'శ్రీనివాస్ తేజ', groomDeg: 'B.Tech', groomHome: 'Santhi Nagar, Kavali',
  bride: 'Srilekha', brideTe: 'శ్రీలేఖ', brideDeg: 'MBA', brideHome: 'Jaggaiahpeta, N.T.R. Dist.',
  hashtag: '#TejaWedsSrilekha',
};

export const muhurtham = new Date('2026-12-10T08:18:00+05:30');

// dress: [label, [hex swatches]] — suggestions, change freely
export const events = [
  {
    key: 'haldi', band: 'linear-gradient(135deg, #e8891d, #f4b41a)', te: 'గంధపు నలుగు', name: 'Haldi', date: 'Wed · 9 Dec 2026', time: '10:00 AM', note: 'Lunch at 12:30 PM',
    venue: 'Our residence, Santhi Nagar, Kavali', map: 'Santhi Nagar, Kavali, Andhra Pradesh',
    dress: ['Haldi yellows & marigold', ['#f4b41a', '#e8891d', '#fff1c1']],
    start: '20261209T100000', end: '20261209T140000',
  },
  {
    key: 'kalyanam', band: 'linear-gradient(135deg, #7a1626, #5e1019)', te: 'కళ్యాణం', name: 'Kalyanam', date: 'Thu · 10 Dec 2026', time: 'Sumuhurtham 8:18 AM', note: 'Mula nakshatram, Dhanus lagnam',
    venue: 'Ukku Kala Vedika, near RTC Bus Stand, Jaggaiahpeta', map: 'Ukku Kala Vedika, Jaggaiahpeta', main: true,
    dress: ['Traditional silks · maroon & gold', ['#7a1626', '#c69a4a', '#f3e2bd']],
    start: '20261210T073000', end: '20261210T130000',
  },
  {
    key: 'vratham', band: 'linear-gradient(135deg, #b3261e, #e8731d)', te: 'సత్యనారాయణ వ్రతం', name: 'Vratham & Vindu', date: 'Fri · 11 Dec 2026', time: '9:00 AM', note: 'Lunch at 12:30 PM',
    venue: 'Sai Nr Heavens Apartment, Santhi Nagar, Kavali', map: 'Sai Nr Heavens Apartment, Santhi Nagar, Kavali',
    dress: ['Soft pastels & whites', ['#f6d6d0', '#dfe8d2', '#fbf6ec']],
    start: '20261211T090000', end: '20261211T140000',
  },
];

export const story = [
  ['Two homes', 'Santhi Nagar, Kavali & Jaggaiahpeta', 'Srinivas Teja (B.Tech), elder son of the Bellamkonda family, and Srilekha (MBA), elder daughter of the Chintala family.'],
  ['The promise', '15 November 2026', 'With both families gathered, the rings were exchanged and the date was fixed.'],
  ['The haldi', '9 December 2026', 'Gandhapu nalugu at home in Kavali — turmeric, laughter and a long lunch.'],
  ['Forever', '10 December 2026 · 8:18 AM', 'Jeelakarra bellam at the sumuhurtham, at Ukku Kala Vedika, Jaggaiahpeta.'],
];

export const quiz = [
  ['What time is the sumuhurtham?', ['7:30 AM', '8:18 AM', '9:00 AM', '10:00 AM'], 1],
  ['Where is the kalyanam?', ['Kavali', 'Vijayawada', 'Ukku Kala Vedika, Jaggaiahpeta', 'Nellore'], 2],
  ['What did Srilekha study?', ['B.Tech', 'MBA', 'M.Sc', 'B.Com'], 1],
  ['And Srinivas Teja?', ['B.Tech', 'MBA', 'B.Sc', 'CA'], 0],
  ['When was the engagement?', ['10 Dec 2026', '1 Nov 2026', '15 Nov 2026', '9 Dec 2026'], 2],
  ['What happens on 9 December?', ['Vratham', 'Sangeet', 'Reception', 'Gandhapu nalugu (Haldi)'], 3],
  ['Which town is Srilekha from?', ['Jaggaiahpeta', 'Kavali', 'Ongole', 'Guntur'], 0],
];

// Gallery: swap these for engagement photos (put them in public/img/gallery/).
export const gallery = [
  ['./img/mandir-couple.jpg', 'Walking towards forever'],
  ['./img/temple-door.jpg', 'The doors of a new home'],
  ['./img/sanctum.jpg', 'In the light of the divine'],
  ['./img/mandir-couple.jpg', 'Together, always'],
];

export const phones = [['Sri Bellamkonda Babu', '9849924573'], ['Family', '9652838788']];
export const rsvpTo = '919849924573';
