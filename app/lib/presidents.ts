export type PresidentTerm = {
  name: string;
  start: string; // 'YYYY-MM'
  end: string;
  color: string; // Hex with alpha e.g., '#FF000080'
  labelColor: string; // Font color for label
}

export const presidentTerms: PresidentTerm[] = [
  {
    name: "김영삼",
    start: "1993-02",
    end: "1998-02",
    color: "#0039904D",
    labelColor: "#0070BB"
  },
  {
    name: "김대중",
    start: "1998-02",
    end: "2003-02",
    color: "#009A444D",
    labelColor: "#001D9F"
  },
  {
    name: "노무현",
    start: "2003-02",
    end: "2008-02",
    color: "#ffd9184D",
    labelColor: "#40B93C"
  },
  {
    name: "이명박",
    start: "2008-02",
    end: "2013-02",
    color: "#0095DA4D",
    labelColor: "#0000A8"
  },
  {
    name: "박근혜",
    start: "2013-02",
    end: "2017-03",
    color: "#C9252B4D",
    labelColor: "#994C4C"
  },
  {
    name: "문재인",
    start: "2017-05",
    end: "2022-05",
    color: "#1524844D",
    labelColor: "#004EA2"
  },
  {
    name: "윤석열",
    start: "2022-05",
    end: "2025-04",
    color: "#E61E2B4D",
    labelColor: "#00B5E2"
  },
  {
    name: "이재명",
    start: "2025-06",
    end: "2030-06",
    color: "#1524844D",
    labelColor: "#004EA2"
  }
];
