import { IndicatorSectionData } from "@/app/lib/domain/indicator.types";
import { IndicatorKey } from "@/app/lib/domain/indicator.keys";

export const STATIC_INDICATOR_SECTIONS: IndicatorSectionData[] = [
  {
    id: "macro-core",
    title: "경제를 이해하기 위한 중요 지표",
    description: "경제의 큰 사이클과 방향성을 이해하는 핵심 지표들입니다.",
    cards: [
        {
        id: "interest-rate",
        title: "금리",
        description:
            "금리는 대내적인 돈의 가격으로, 소비와 투자 결정에 직접적인 영향을 줍니다. 금리가 낮아지면 차입과 투자가 늘어나 경기가 활성화되고, 금리가 높아지면 소비와 투자가 위축되어 물가 안정에 기여합니다.",
        href: "/series/base-rate-korea",
        indicators: [
            {
            key: IndicatorKey.BaseRate,
            label: "기준금리",
            hint: "한국은행이 정하는 정책금리로, 예금·대출 등 모든 시중 금리의 기준이 됩니다."
            }
        ]
        },

        {
        id: "exchange-rate",
        title: "환율",
        description:
            "환율은 한 나라 돈의 대외적인 가격으로, 수출입 가격과 외국인 자본 흐름에 큰 영향을 미칩니다. 원화 가치가 하락하면 수출에는 유리하지만 수입 물가가 상승할 수 있습니다.",
        href: "/series/exchange-rate-dollar-korea",
        indicators: [
            {
            key: IndicatorKey.UsdKrw,
            label: "원/달러 환율",
            hint: "원화와 달러의 교환 비율로, 한국 경제의 대외 여건을 가장 직관적으로 보여주는 지표입니다."
            }
        ]
        },

        {
        id: "gdp",
        title: "국내총생산(GDP)",
        description:
            "국내총생산은 한 나라에서 일정 기간 동안 생산된 모든 재화와 서비스의 부가가치를 합한 값으로, 경제 규모와 성장 속도를 보여줍니다. 소비+투자+정부지출+(수출-수입).",
        href: "/series/real-gdp-korea/current-account-balance-korea",
        indicators: [
            {
            key: IndicatorKey.RealGdp,
            label: "실질 GDP",
            hint: "물가 영향을 제거한 GDP로, 경제의 실제 성장 여부를 판단하는 핵심 지표입니다."
            },
            {
            key: IndicatorKey.CurrentAccount,
            label: "경상수지",
            hint: "수출입과 해외 소득을 포함한 대외 거래 결과로, 성장의 지속 가능성을 보여줍니다."
            }
        ]
        },

        {
        id: "inflation",
        title: "물가",
        description:
            "물가는 전반적인 가격 수준을 나타내며, 가계의 실질 구매력과 통화정책 결정에 중요한 기준이 됩니다. 물가 상승이 지속되면 금리 인상 압력이 커집니다. 인플레이션은 물가 상승이 지속적으로 상승하여 화폐 가치가 하락하여, 같은 돈으로 살 수 있는 물건의 양이 줄어듭니다.",
        href: "/series/cpi-korea/ppi-korea",
        indicators: [
            {
            key: IndicatorKey.Cpi,
            label: "소비자물가지수(CPI)",
            hint: "가계가 실제로 구매하는 상품과 서비스의 가격 변화를 반영한 체감 물가 지표입니다."
            },
            {
            key: IndicatorKey.Ppi,
            label: "생산자물가지수(PPI)",
            hint: "기업이 상품을 생산할 때 받는 가격으로, 향후 소비자 물가의 선행 신호로 활용됩니다."
            }
        ]
        },

        {
        id: "employment",
        title: "실업률",
        description:
            "실업률은 일할 의사가 있지만 일자리를 구하지 못한 사람의 비율로, 경기 상황과 체감 경제를 판단하는 중요한 지표입니다. 안정적인 급여는 안정적인 소비가 가능합니다.",
        href: "/series/unemployment-rate-korea",
        indicators: [
            {
            key: IndicatorKey.UnemploymentRate,
            label: "실업률",
            hint: "경기 둔화 시 상승하는 경향이 있으며, 소비 여력과 직결되는 후행 지표입니다."
            }
        ]
        }
    ]
  },
  {
    id: "real-economy",
    title: "실물경제를 이해하는 지표",
    description: "사람과 기업이 실제로 생산하고 소비하며 일하고 있는 상태를 보여주는 지표들입니다.",
    cards: [
        {
        id: "yield-curve",
        title: "장단기 금리차",
        description:
            "장단기 금리차는 금융시장이 바라보는 경기 사이클을 보여주는 대표적인 선행 지표입니다. 장기 금리가 단기 금리보다 낮아지는 역전 현상은 경기 침체 가능성으로 해석됩니다.",
        href: "/indicators/treasury-bond-korea-10/treasury-bond-korea-3",
        indicators: [
            {
            key: IndicatorKey.KoreaGovBond10Y,
            label: "국채 10년 금리",
            hint: "장기 성장과 물가에 대한 시장의 기대를 반영합니다."
            },
            {
            key: IndicatorKey.KoreaGovBond3Y,
            label: "국채 3년 금리",
            hint: "현재 통화정책과 단기 경기 상황을 반영합니다."
            }
        ]
        },

        {
        id: "liquidity",
        title: "통화량(M2)",
        description:
            "통화량은 경제 전반에 얼마나 많은 돈이 풀려 있는지를 보여주는 지표로, 실물경제와 자산시장에 영향을 미치는 유동성 환경을 나타냅니다.",
        href: "/series/m2-korea",
        indicators: [
            {
            key: IndicatorKey.M2,
            label: "광의통화(M2)",
            hint: "현금과 예금 등 시중에 유통 가능한 돈의 규모로, 소비와 투자 여건을 판단하는 데 활용됩니다."
            }
        ]
        },

        {
        id: "credit-risk",
        title: "금융 스트레스와 신용 위험",
        description:
            "회사채 스프레드는 기업의 신용 위험에 대한 시장의 평가를 보여주며, 경기 둔화나 금융 불안 국면에서 빠르게 확대됩니다.",
        href: "/series/treasury-bond-korea-10/corporate-bond-korea-3-aa",
        indicators: [
            {
            key: IndicatorKey.KoreaGovBond3Y,
            label: "국채 3년 금리",
            hint: "국가의 무위험 금리로, 금융시장의 기준이 되는 금리입니다."
            },
            {
            key: IndicatorKey.CorpBond3Y,
            label: "회사채 3년 금리",
            hint: "기업의 신용 위험을 반영한 금리로, 경기 상황에 따라 변동성이 커집니다."
            }
        ]
        }
    ]
  },

  {
    id: "asset-market",
    title: "주식 시장을 이해하기 위한 중요 지표",
    description: "주식시장은 기업 실적보다 먼저 금리, 경기 기대, 자금 흐름을 반영합니다.",
    cards: [
        {
        id: "stock-index",
        title: "주가지수",
        description:
            "주가지수는 시장 참여자들이 바라보는 경기와 기업 이익에 대한 종합적인 기대를 반영합니다.",
        href: "/series/kospi/kosdaq",
        indicators: [
            {
            key: IndicatorKey.KospiIndex,
            label: "코스피 지수",
            hint: "한국 대형주 중심의 대표 주가지수로, 전체 시장 방향성을 보여줍니다."
            },
            {
            key: IndicatorKey.KosdaqIndex,
            label: "코스닥 지수",
            hint: "중소·성장주 중심 지수로, 위험 선호와 성장 기대를 반영합니다."
            }
        ]
        },

        {
        id: "interest-rate-stock",
        title: "금리와 주식시장",
        description:
            "금리는 주식의 할인율 역할을 하며, 장기 금리 변동은 주가에 직접적인 영향을 미칩니다.",
        href: "/series/treasury-bond-korea-10/base-rate-korea",
        indicators: [
            {
            key: IndicatorKey.LongTermRate,
            label: "10년물 국채금리",
            hint: "장기 금리가 급등하면 성장주와 기술주에 부담이 되며, 금리 안정은 주식시장에 우호적입니다."
            },
            {
            key: IndicatorKey.BaseRate,
            label: "기준금리",
            hint: "통화정책의 방향을 나타내며, 유동성과 투자 심리에 영향을 줍니다."
            }
        ]
        },

        {
        id: "liquidity-stock",
        title: "유동성과 주식시장",
        description:
            "주식시장은 실물경제보다 유동성 변화에 먼저 반응하는 경향이 있습니다.",
        href: "/series/m2-korea",
        indicators: [
            {
            key: IndicatorKey.M2,
            label: "광의통화(M2)",
            hint: "시중에 풀린 자금의 규모로, 주식시장으로 유입될 수 있는 잠재 유동성을 보여줍니다."
            },
            {
            key: IndicatorKey.StockVolume,
            label: "거래대금",
            hint: "시장 참여 강도를 나타내며, 상승·하락의 신뢰도를 판단하는 데 활용됩니다."
            }
        ]
        },

        {
        id: "external-balance-stock",
        title: "대외 여건과 주식시장",
        description:
            "환율과 대외 수지는 외국인 자금 흐름을 통해 주식시장에 영향을 미칩니다.",
        href: "/series/exchange-rate-dollar-korea/current-account-balance-korea",
        indicators: [
            {
            key: IndicatorKey.UsdKrw,
            label: "원/달러 환율",
            hint: "원화 약세는 외국인 수급에 부담을 주고, 강세는 자금 유입에 우호적입니다."
            },
            {
            key: IndicatorKey.CurrentAccount,
            label: "경상수지",
            hint: "대외 수지의 안정성으로, 한국 주식시장의 기초 체력을 보여줍니다."
            }
        ]
        },

        {
        id: "inflation-stock",
        title: "물가와 주식시장",
        description:
            "물가는 기업 실적과 금리 정책을 통해 주식시장에 간접적인 영향을 줍니다.",
        href: "/series/cpi-korea",
        indicators: [
            {
            key: IndicatorKey.Cpi,
            label: "소비자물가지수(CPI)",
            hint: "물가 상승은 단기적으로 실적 기대를 높일 수 있으나, 중기적으로는 금리 인상 부담을 키울 수 있습니다."
            },
            {
            key: IndicatorKey.CoreCpi,
            label: "근원물가",
            hint: "일시적 요인을 제거한 물가 흐름으로, 통화정책과 주식시장 방향 판단에 중요합니다."
            }
        ]
        }
    ]
  },

  {
    id: "real-estate-market",
    title: "부동산 시장을 이해하기 위한 중요 지표",
    description: "부동산 시장은 금리, 거래 심리, 거주 수요가 복합적으로 반영되는 자산시장입니다.",
    cards: [
        {
        id: "real-estate-transaction",
        title: "부동산 거래 심리",
        description:
            "부동산 가격보다 거래량이 먼저 움직이며, 거래 심리는 시장의 방향성을 판단하는 데 중요한 단서가 됩니다.",
        href: "/series/apt-price-index-seoul/apt-volume-seoul",
        indicators: [
            {
            key: IndicatorKey.AptPrice,
            label: "아파트 실거래가 지수",
            hint: "실제로 거래된 가격을 기반으로 한 주택 가격 흐름입니다."
            },
            {
            key: IndicatorKey.AptVolume,
            label: "아파트 거래량",
            hint: "매수·매도 심리를 반영하며, 가격 변동의 선행 신호로 활용됩니다."
            }
        ]
        },

        {
        id: "jeonse-market",
        title: "전세 시장",
        description:
            "전세 시장은 실수요자의 거주 여건을 반영하며, 매매 시장의 선행 지표로 자주 활용됩니다.",
        href: "/series/apt-price-index-seoul",
        indicators: [
            {
            key: IndicatorKey.JeonsePrice,
            label: "전세가격지수",
            hint: "전세 수요와 공급 상황을 반영한 거주 비용 지표입니다."
            },
            {
            key: IndicatorKey.AptPrice,
            label: "아파트 실거래가 지수",
            hint: "전세 가격 변화가 매매 가격으로 이어지는지를 함께 비교합니다."
            }
        ]
        },

        {
        id: "loan-burden",
        title: "대출 부담과 집값",
        description:
            "주택담보대출 금리는 주택 구매 가능성을 결정하는 핵심 요소로, 집값의 상한선을 형성합니다.",
        href: "/series/mortgage-rate-korea/apt-price-index-seoul",
        indicators: [
            {
            key: IndicatorKey.HouseLoanRate,
            label: "주택담보대출 금리",
            hint: "금리가 상승하면 대출 부담이 커져 주택 수요가 위축될 수 있습니다."
            },
            {
            key: IndicatorKey.AptPrice,
            label: "아파트 실거래가 지수",
            hint: "대출 부담 변화가 실제 집값에 어떻게 반영되는지를 보여줍니다."
            }
        ]
        }
    ]
    }

];
