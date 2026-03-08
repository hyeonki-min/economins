import { VehiclePreset, VehicleType } from "@/app/lib/definitions";


export const VEHICLES: Record<VehicleType, VehiclePreset> = {

  compact: {
    label: "경차",
    tank: 35,
    efficiency: 15,
    icon: "🚗",
  },

  compactSedan: {
    label: "준중형",
    tank: 50,
    efficiency: 13,
    icon: "🚙",
  },

  midsize: {
    label: "중형",
    tank: 60,
    efficiency: 11,
    icon: "🚘",
  },

  large: {
    label: "대형",
    tank: 70,
    efficiency: 9,
    icon: "🚙",
  },

  truck5t: {
    label: "5톤 트럭",
    tank: 200,
    efficiency: 4,
    icon: "🚛",
  },

}