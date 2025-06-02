export type Events = {
  id: string;
  name: string;
  date: string;
};

export const events : Events[] = [
  { id: 'terror-911', name: '9.11테러', date: '2001-09' },
  { id: 'iraq-war', name: '이라크 전쟁', date: '2003-03' },
  { id: 'great-recession', name: '금융위기', date: '2008-09' },
  { id: 'eurozone-crisis', name: '유로존 위기', date: '2010-02' },
  { id: 'mers', name: '메르스', date: '2013-05' },
  { id: 'buy-a-house-with-debt', name: '빚내서 집사라 정책', date: '2014-07' },
  { id: 'hallyu-ban', name: '한한령', date: '2017-09' },
  { id: 'us-china-trade-war', name: '미-중 무역 분쟁', date: '2018-07' },
  { id: 'covid-19', name: '코로나19 팬데믹', date: '2020-01' },
  { id: 'ukraine-war', name: '우크라이나전쟁', date: '2022-02' },
  { id: 'emergency-martial-law', name: '비상계엄', date: '2024-12' },
  { id: 'global-trade-dispute', name: '세계 무역 분쟁', date: '2025-02' },
]
