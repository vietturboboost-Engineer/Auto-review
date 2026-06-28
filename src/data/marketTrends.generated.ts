/**
 * DỮ LIỆU XU HƯỚNG THỊ TRƯỜNG (tự sinh — KHÔNG sửa tay).
 *
 * Sinh bởi:  npm run build && npm run collect:market
 *
 * Nguồn: feed RSS tin xe + file đã kiểm chứng trong src/data/market-data/.
 * Mỗi giá trị đều kèm nguồn (publisher). Chỉ lấy thông tin nguồn công bố rõ ràng,
 * KHÔNG bịa số liệu. Ngưỡng nguồn tối thiểu cấu hình qua MARKET_MIN_SOURCES (mặc định 1).
 */
import type { MarketTrendsData } from './vehicles.js';

export const collectedMarketTrends: Record<string, MarketTrendsData> = {
  "toyota-camry": {
    "alerts": [],
    "events": [
      {
        "period": "2026-06-24",
        "label": "Toyota Camry bỏ máy xăng, chỉ bán bản hybrid tại Việt Nam"
      },
      {
        "period": "2026-06-24",
        "label": "Toyota Camry bỏ bớt phiên bản ở Việt Nam, chỉ còn động cơ hybrid"
      }
    ],
    "source": "VnExpress, Tuổi Trẻ"
  },
  "toyota-fortuner": {
    "alerts": [
      "🆕 Ra mắt / mở bán"
    ],
    "events": [
      {
        "period": "2026-06-25",
        "label": "Toyota Fortuner ở Việt Nam không còn bản máy dầu"
      },
      {
        "period": "2026-06-23",
        "label": "Toyota Fortuner đời mới chưa ra mắt đã lộ diện trên đường, sự thật bất ngờ"
      }
    ],
    "source": "Tuổi Trẻ"
  },
  "toyota-hilux": {
    "alerts": [],
    "events": [
      {
        "period": "2026-06-22",
        "label": "Toyota Hilux giữ nhịp doanh số, chờ sóng phục hồi sau chính sách mới"
      },
      {
        "period": "2026-06-22",
        "label": "Bán tải điện nhỏ như Hyundai i10, khả năng sạc hiếm xe có, thùng ngang ngửa Toyota Hilux"
      }
    ],
    "source": "Tuổi Trẻ"
  },
  "honda-crv": {
    "alerts": [],
    "events": [
      {
        "period": "2026-06-26",
        "label": "Honda Avancier - SUV 7 chỗ đàn anh CR-V sắp bán ở Đông Nam Á"
      }
    ],
    "source": "VnExpress"
  },
  "hyundai-tucson": {
    "alerts": [],
    "events": [
      {
        "period": "2026-06-22",
        "label": "Tin tức giá xe: Hyundai Tucson giảm tới 100 triệu tại đại lý, 'đọ giá' với SUV B"
      }
    ],
    "source": "Tuổi Trẻ"
  },
  "hyundai-palisade": {
    "alerts": [],
    "events": [
      {
        "period": "2026-06-27",
        "label": "Hyundai Palisade đời mới lộ diện ở Việt Nam, dễ bỏ máy dầu"
      }
    ],
    "source": "Tuổi Trẻ"
  },
  "kia-carnival": {
    "alerts": [
      "🔻 Giảm giá / ưu đãi"
    ],
    "events": [
      {
        "period": "2026-06-25",
        "label": "Kia Carnival Hybrid có phiên bản giá dễ tiếp cận từ 1,379 tỷ đồng"
      },
      {
        "period": "2026-06-25",
        "label": "Kia Carnival thêm bản hybrid giá rẻ ở Việt Nam, giá thực tế từ 1,379 tỉ đồng"
      },
      {
        "period": "2026-06-22",
        "label": "Tin tức giá xe: Kia Carnival giảm giá tới 150 triệu ở đại lý"
      }
    ],
    "source": "Tuổi Trẻ, VnExpress"
  },
  "mazda-cx5": {
    "alerts": [
      "🆕 Thế hệ mới"
    ],
    "events": [
      {
        "period": "2026-06-24",
        "label": "Mazda CX-5 thế hệ mới 'cháy hàng'"
      },
      {
        "period": "2026-06-23",
        "label": "Mazda CX-5 hybrid mới hứa hẹn được định giá 'mềm' hơn đối thủ, nhưng khó áp dụng ở Việt Nam?"
      }
    ],
    "source": "VnExpress, Tuổi Trẻ"
  },
  "vinfast-vf3": {
    "alerts": [],
    "events": [
      {
        "period": "2026-06-23",
        "label": "VinFast VF 3 được dùng làm xe tuần tra ở Philippines"
      }
    ],
    "source": "Tuổi Trẻ"
  },
  "hyundai-grand-i10": {
    "alerts": [],
    "events": [
      {
        "period": "2026-06-27",
        "label": "'Hyundai Grand i10 bản điện' thêm bản cận sang: Ghế da thật, loa Kevlar, vải dệt kim"
      }
    ],
    "source": "Tuổi Trẻ"
  },
  "hyundai-elantra": {
    "alerts": [
      "🆕 Ra mắt / mở bán"
    ],
    "events": [
      {
        "period": "2026-06-27",
        "label": "Hyundai Elantra 2027 - cú lột xác toàn diện"
      },
      {
        "period": "2026-06-26",
        "label": "Hyundai Elantra đời mới ra mắt, lột xác từ trong ra ngoài"
      }
    ],
    "source": "Tuổi Trẻ, VnExpress"
  },
  "mitsubishi-attrage": {
    "alerts": [
      "🆕 Ra mắt / mở bán"
    ],
    "events": [
      {
        "period": "2026-06-27",
        "label": "Mitsubishi Attrage chốt lịch ra mắt, dễ lần đầu có 6 túi khí, dùng được xăng E20"
      }
    ],
    "source": "Tuổi Trẻ"
  },
  "porsche-cayenne": {
    "alerts": [],
    "events": [
      {
        "period": "2026-06-25",
        "label": "Porsche Cayenne EV - sự mê hoặc của gia tốc tĩnh lặng"
      }
    ],
    "source": "VnExpress"
  },
  "geely-coolray": {
    "alerts": [],
    "events": [
      {
        "period": "2026-06-26",
        "label": "Tin tức giá xe: Geely Coolray giảm gần 90 triệu tại đại lý, rẻ như SUV A với trang bị của SUV B"
      }
    ],
    "source": "Tuổi Trẻ"
  },
  "audi-q3": {
    "alerts": [
      "🆕 Thế hệ mới"
    ],
    "events": [
      {
        "period": "2026-06-23",
        "label": "Audi Q3 Sportback thế hệ mới giá gần 2,2 tỷ đồng"
      }
    ],
    "source": "VnExpress"
  }
};
