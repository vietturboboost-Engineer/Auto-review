// Ưu / nhược điểm viết riêng cho từng mẫu xe (đánh giá kiểu reviewer thực tế tại VN).
// Mỗi xe là một bài review độc lập, KHÔNG sinh theo template/segment.
// Khi cần override: điền pros/cons trực tiếp trong mk({...}) — sẽ ưu tiên cao hơn map này.

export interface Review {
  pros: string[];
  cons: string[];
}

export const reviews: Record<string, Review> = {
  // ===== Toyota =====
  'toyota-vios': {
    pros: ['Chi phí nuôi xe rất thấp', 'Giữ giá tốt nhất phân khúc', 'Độ bền cao, ít hỏng vặt', 'Khoang sau rộng, dễ sửa chữa'],
    cons: ['Động cơ 1.5 yếu, tăng tốc chậm', 'Cách âm kém ở tốc độ cao', 'Nội thất nhiều nhựa cứng'],
  },
  'toyota-corolla-cross': {
    pros: ['Bản Hybrid tiết kiệm xăng ấn tượng', 'Gói an toàn Toyota Safety Sense đầy đủ', 'Gầm cao, dễ đi đường xấu', 'Vận hành bền bỉ'],
    cons: ['Giá nhỉnh hơn đối thủ cùng cỡ', 'Cách âm sàn xe chưa tốt', 'Thiết kế nội thất hơi đơn điệu'],
  },
  'toyota-camry': {
    pros: ['Vận hành êm ái, sang trọng', 'Hybrid tiết kiệm và mượt', 'Giữ giá tốt, dễ bán lại', 'Độ bền và độ tin cậy cao'],
    cons: ['Thiết kế bảo thủ, kén người trẻ', 'Vô-lăng nhẹ, thiếu cảm giác lái', 'Màn hình giải trí lỗi thời'],
  },
  'toyota-yaris-cross': {
    pros: ['Hybrid uống xăng rất ít trong phố', 'An toàn nhiều trang bị so với giá', 'Nhỏ gọn, dễ luồn lách và đỗ'],
    cons: ['Động cơ yếu khi đi đường trường', 'Khoang ghế sau và cốp khá hẹp', 'Giá bán cao so với kích cỡ'],
  },
  'toyota-innova': {
    pros: ['Hybrid hiếm hoi trong phân khúc MPV', '7 chỗ rộng rãi, ghế linh hoạt', 'An toàn đầy đủ, chạy dịch vụ bền', 'Tiết kiệm nhiên liệu tốt'],
    cons: ['Giá tăng mạnh so với đời cũ', 'Thân xe to, xoay trở trong phố hơi khó', 'Vật liệu nội thất chưa cao cấp'],
  },
  'toyota-fortuner': {
    pros: ['Bền bỉ, hợp đường xấu và off-road nhẹ', 'Máy dầu kéo khỏe, bền', 'Giữ giá tốt, thanh khoản cao'],
    cons: ['Cách âm và giảm chấn chưa tốt', 'Nội thất cứng, ít cảm giác cao cấp', 'Khá hao dầu khi chạy trong phố'],
  },
  'toyota-hilux': {
    pros: ['Độ bền gần như huyền thoại', 'Khả năng off-road và lội nước tốt', 'Máy dầu bền, giữ giá cao'],
    cons: ['Tăng tốc chậm, lái cứng khi không tải', 'Nội thất đơn giản, ít tiện nghi', 'Cồng kềnh khi di chuyển trong đô thị'],
  },
  // ===== Honda =====
  'honda-city': {
    pros: ['Động cơ 1.5 mạnh và mượt nhất phân khúc', 'Cảm giác lái vui, chính xác', 'Khoang cabin rộng rãi', 'Tiết kiệm nhiên liệu tốt'],
    cons: ['Cách âm gầm và lốp còn ồn', 'Giảm xóc hơi cứng khi qua ổ gà', 'Bản thấp thiếu một số trang bị an toàn'],
  },
  'honda-civic': {
    pros: ['Động cơ turbo mạnh, bốc', 'Cảm giác lái thể thao, bám đường tốt', 'Nội thất hiện đại, hoàn thiện kỹ', 'Honda Sensing đầy đủ'],
    cons: ['Gầm thấp, dễ cấn khi vào dốc', 'Giá cao so với mặt bằng hạng C', 'Cách âm chưa thực sự êm'],
  },
  'honda-hrv': {
    pros: ['Thiết kế trẻ trung, bắt mắt', 'Bản e:HEV vận hành êm và tiết kiệm', 'Trang bị tiện nghi và an toàn tốt'],
    cons: ['Giá cao nhất phân khúc B SUV', 'Cốp và gầm ghế sau không quá rộng', 'Hơi ồn khi tăng ga lớn'],
  },
  'honda-crv': {
    pros: ['Cabin rộng, tiện nghi gia đình', 'Bản Hybrid mạnh mẽ, mượt mà', 'Vận hành chắc chắn, an toàn cao'],
    cons: ['Giá bán cao', 'Hàng ghế thứ 3 chật, chỉ hợp trẻ em', 'Cách âm tiếng gió ở tốc độ cao'],
  },
  'honda-accord': {
    pros: ['Động cơ turbo khỏe, lái phấn khích', 'Khoang nội thất rộng và yên tĩnh', 'Trang bị an toàn Honda Sensing tốt'],
    cons: ['Ế khách tại VN nên giữ giá kém', 'Thiết kế kén người mua', 'Giá cao so với đối thủ Nhật'],
  },
  // ===== Mitsubishi =====
  'mitsubishi-xpander': {
    pros: ['Bán chạy nhờ bền và tiết kiệm', 'Khoang 7 chỗ thực dụng, dễ dùng', 'Chi phí nuôi thấp, giữ giá tốt'],
    cons: ['Máy 1.5 yếu khi chở đủ tải', 'Cách âm kém, thân xe rung khi non hơi', 'Trang bị an toàn cơ bản'],
  },
  'mitsubishi-xforce': {
    pros: ['Thiết kế cá tính, hiện đại', 'Gầm cao, không gian nội thất khá', 'Giá hợp lý, nhiều màn hình và tiện ích'],
    cons: ['Động cơ 1.5 hút khí tự nhiên yếu', 'Không có bản máy mạnh hơn', 'Cách âm ở mức trung bình'],
  },
  'mitsubishi-outlander': {
    pros: ['Giá bán cạnh tranh trong hạng C', 'Khoang cabin rộng rãi', 'Đầm chắc khi đi đường trường'],
    cons: ['Thiết kế và công nghệ đã cũ', 'Động cơ thiếu hào hứng', 'Cách âm chưa tốt'],
  },
  'mitsubishi-triton': {
    pros: ['Máy dầu mới khỏe, vận hành mượt', 'Off-road tốt với Super Select 4WD', 'Vô-lăng nhẹ, dễ lái hằng ngày'],
    cons: ['Giữ giá kém Ranger và Hilux', 'Cách âm khoang máy chưa tốt', 'Thương hiệu bán tải chưa thật mạnh'],
  },
  'mitsubishi-pajero-sport': {
    pros: ['Khả năng off-road đáng nể', 'Bền bỉ, hợp đường xấu', 'Cabin 7 chỗ rộng'],
    cons: ['Thiết kế và nội thất đã lỗi thời', 'Cách âm kém', 'Giữ giá thấp hơn đối thủ'],
  },
  // ===== Hyundai =====
  'hyundai-accent': {
    pros: ['Khoang cabin rộng nhất phân khúc', 'Trang bị nhiều so với tầm giá', 'Tiết kiệm nhiên liệu, dễ chạy dịch vụ'],
    cons: ['Cách âm kém, nhựa nội thất rẻ tiền', 'Giữ giá thua Vios', 'Vô-lăng thiếu cảm giác'],
  },
  'hyundai-creta': {
    pros: ['Trang bị công nghệ phong phú', 'Thiết kế trẻ, gầm cao thoáng tầm nhìn', 'Giá hợp lý trong hạng B SUV'],
    cons: ['Động cơ 1.5 yếu khi chở đủ người', 'Cách âm trung bình', 'Cảm giác lái nhạt'],
  },
  'hyundai-tucson': {
    pros: ['Thiết kế ấn tượng, nổi bật', 'Khoang rộng, trang bị nhiều', 'Giá cạnh tranh so với xe Nhật'],
    cons: ['Máy 2.0 hút khí tự nhiên đuối', 'Hay gặp lỗi vặt điện tử', 'Giữ giá kém hơn CR-V'],
  },
  'hyundai-santafe': {
    pros: ['Thiết kế vuông vức bề thế', 'Cabin 7 chỗ rộng, ghế 2 thoải mái', 'Trang bị an toàn và tiện nghi cao'],
    cons: ['Hàng ghế 3 vẫn khá chật', 'Giá bản cao chạm ngưỡng xe sang cỡ nhỏ', 'Cách âm gió ở tốc độ cao'],
  },
  'hyundai-palisade': {
    pros: ['Không gian rất rộng, sang trọng', 'Máy dầu 2.2 êm và tiết kiệm', 'Trang bị tiện nghi đầy đủ'],
    cons: ['Thân xe lớn khó xoay trong phố', 'Giá cao, kén khách', 'Mạng lưới dịch vụ chưa nhiều như Toyota'],
  },
  // ===== Kia =====
  'kia-sonet': {
    pros: ['Giá mềm, nhiều trang bị', 'Nhỏ gọn dễ lái phố', 'Thiết kế cá tính'],
    cons: ['Cách âm và vật liệu ở mức cơ bản', 'Động cơ 1.5 yếu', 'Cốp nhỏ'],
  },
  'kia-seltos': {
    pros: ['Trang bị công nghệ nhiều', 'Thiết kế đẹp, nhiều lựa chọn', 'Giá hợp lý'],
    cons: ['Bản 1.5 hút khí yếu', 'Cách âm trung bình', 'Chất lượng hoàn thiện chưa đồng đều'],
  },
  'kia-sportage': {
    pros: ['Thiết kế hiện đại, sắc sảo', 'Cabin rộng và tiện nghi', 'Nhiều công nghệ an toàn'],
    cons: ['Giá bản cao khá đắt', 'Động cơ xăng 2.0 chưa mạnh', 'Phí dịch vụ phụ tùng nhỉnh'],
  },
  'kia-sorento': {
    pros: ['Lựa chọn máy dầu/hybrid đa dạng', 'Cabin 7 chỗ rộng, sang', 'Trang bị an toàn cao cấp'],
    cons: ['Giá bản full khá cao', 'Hàng ghế 3 hợp người nhỏ', 'Một số lỗi điện tử lẻ tẻ'],
  },
  'kia-carnival': {
    pros: ['Không gian cực rộng, sang như limousine', 'Máy dầu kéo khỏe, tiết kiệm', 'Cửa trượt điện tiện lợi cho gia đình'],
    cons: ['Thân xe rất dài, khó đỗ', 'Giá bản cao đắt đỏ', 'Chi phí phụ tùng cao'],
  },
  // ===== Mazda =====
  'mazda-2': {
    pros: ['Thiết kế đẹp, nội thất chỉn chu', 'Lái chắc chắn, vô-lăng đầm', 'Tiết kiệm nhiên liệu'],
    cons: ['Khoang sau và cốp nhỏ', 'Máy 1.5 vừa đủ dùng', 'Giá cao so với kích cỡ'],
  },
  'mazda-3': {
    pros: ['Thiết kế đẹp bậc nhất phân khúc', 'Cảm giác lái tốt, đầm chắc', 'Nội thất cao cấp, hoàn thiện kỹ'],
    cons: ['Hàng ghế sau hơi chật', 'Khoảng sáng gầm thấp', 'Cách âm chưa tương xứng giá'],
  },
  'mazda-cx5': {
    pros: ['Thiết kế sang, lái cân bằng', 'Giá bán hấp dẫn nhờ ưu đãi', 'Nội thất đẹp, tiện nghi tốt'],
    cons: ['Động cơ 2.0 yếu khi đầy tải', 'Cách âm gầm chưa tốt', 'Màn giải trí cũ'],
  },
  'mazda-cx8': {
    pros: ['Cabin 7 chỗ rộng và sang', 'Vận hành êm, cách âm khá', 'Giá tốt nhờ khuyến mãi'],
    cons: ['Máy 2.5 hơi đuối khi chở đủ tải', 'Hàng ghế 3 vừa phải', 'Công nghệ giải trí lạc hậu'],
  },
  // ===== Nissan =====
  'nissan-almera': {
    pros: ['Máy 1.0 turbo tiết kiệm, đủ dùng', 'Cabin rộng so với cỡ xe', 'Giá hợp lý'],
    cons: ['Nội thất đơn giản, nhựa rẻ', 'Cách âm kém', 'Thanh khoản bán lại thấp'],
  },
  'nissan-kicks': {
    pros: ['Hệ truyền động e-Power lái như xe điện', 'Vận hành êm, mượt', 'Tiết kiệm nhiên liệu trong phố'],
    cons: ['Giá cao so với phân khúc B', 'Ồn động cơ khi tăng tốc gấp', 'Ít đại lý, thanh khoản kém'],
  },
  'nissan-navara': {
    pros: ['Khung gầm đa liên kết cho cảm giác êm', 'Máy dầu twin-turbo khỏe', 'Cabin tiện nghi cho bán tải'],
    cons: ['Giữ giá kém Ranger/Hilux', 'Mạng lưới dịch vụ mỏng', 'Off-road không bằng đối thủ'],
  },
  // ===== Subaru =====
  'subaru-forester': {
    pros: ['Dẫn động AWD đối xứng cân bằng, an toàn', 'Tầm nhìn thoáng, cabin rộng', 'EyeSight hỗ trợ lái tốt'],
    cons: ['Động cơ boxer hơi ồn và hao xăng', 'Giá cao, ít khuyến mãi', 'Thiết kế đơn giản'],
  },
  'subaru-crosstrek': {
    pros: ['AWD chuẩn, vững vàng đường trơn', 'Gầm cao đi đường xấu tốt', 'An toàn EyeSight đầy đủ'],
    cons: ['Máy 2.0 yếu, ồn', 'Giá cao so với kích cỡ', 'Tiêu hao nhiên liệu chưa tốt'],
  },
  'subaru-outback': {
    pros: ['Wagon gầm cao đa dụng hiếm có', 'AWD và an toàn tốt cho đường dài', 'Cabin rộng, chở đồ thoải mái'],
    cons: ['Giá cao, kén khách tại VN', 'Hao xăng', 'Thanh khoản bán lại thấp'],
  },
  // ===== Suzuki =====
  'suzuki-swift': {
    pros: ['Nhỏ gọn, linh hoạt trong phố', 'Tiết kiệm nhiên liệu', 'Lái nhẹ nhàng, dễ chịu'],
    cons: ['Máy 1.2 yếu', 'Cách âm và trang bị cơ bản', 'Cabin và cốp nhỏ'],
  },
  'suzuki-xl7': {
    pros: ['MPV 7 chỗ gầm cao giá mềm', 'Mild-hybrid tiết kiệm', 'Bền, chi phí nuôi thấp'],
    cons: ['Máy 1.5 yếu khi đủ tải', 'Cách âm kém', 'An toàn ở mức cơ bản'],
  },
  'suzuki-jimny': {
    pros: ['Off-road thực thụ ấn tượng dù nhỏ', 'Thiết kế cá tính, độc đáo', 'Nhỏ gọn, dễ luồn lách'],
    cons: ['Chỉ 4 chỗ, cốp rất nhỏ', 'Ồn và xóc khi chạy đường trường', 'Máy yếu, hao xăng'],
  },
  // ===== Ford =====
  'ford-ranger': {
    pros: ['Vua bán tải tại VN, giữ giá cao', 'Máy dầu mạnh, nhiều phiên bản', 'Cabin tiện nghi như xe con, công nghệ tốt'],
    cons: ['Bản cao giá đắt', 'Thân xe lớn khó đỗ trong phố', 'Chi phí phụ tùng không rẻ'],
  },
  'ford-everest': {
    pros: ['Vận hành chắc chắn, lái như xe con', 'Máy dầu mạnh, kéo tốt', 'Nhiều công nghệ an toàn ADAS'],
    cons: ['Giá bán cao trong nhóm SUV 7 chỗ', 'Hao dầu khi chạy phố', 'Một số lỗi điện tử trên đời đầu'],
  },
  // ===== Chevrolet / Isuzu =====
  'chevrolet-trailblazer': {
    pros: ['Khung gầm chắc, đầm đường trường', 'Cabin rộng', 'Trang bị an toàn khá'],
    cons: ['Hãng đã rút khỏi VN, khó phụ tùng', 'Hao xăng', 'Cách âm chưa tốt'],
  },
  'chevrolet-colorado': {
    pros: ['Động cơ mạnh, kéo khỏe', 'Khung gầm bền bỉ', 'Off-road tốt'],
    cons: ['Khó tìm phụ tùng do hãng rút lui', 'Tiêu hao nhiên liệu cao', 'Nội thất đã cũ'],
  },
  'isuzu-dmax': {
    pros: ['Máy dầu siêu bền, tiết kiệm', 'Chi phí vận hành thấp', 'Hợp chở hàng, kinh doanh'],
    cons: ['Tăng tốc chậm, lái cứng', 'Nội thất đơn giản', 'Thương hiệu kén khách cá nhân'],
  },
  'isuzu-mux': {
    pros: ['Máy dầu bền và tiết kiệm', 'Khung gầm chắc chắn', 'Chi phí nuôi xe thấp'],
    cons: ['Thiết kế và nội thất đơn giản', 'Cách âm trung bình', 'Ít công nghệ so với đối thủ'],
  },
  // ===== Mercedes-Benz =====
  'mercedes-cclass': {
    pros: ['Nội thất sang như S-Class thu nhỏ', 'Cách âm và vận hành êm ái', 'Thương hiệu danh giá, nhiều công nghệ'],
    cons: ['Chi phí bảo dưỡng và phụ tùng cao', 'Không gian ghế sau vừa phải', 'Một số lỗi điện tử vặt'],
  },
  'mercedes-eclass': {
    pros: ['Cabin rộng, cực kỳ êm và yên tĩnh', 'Nội thất sang trọng, nhiều màn hình', 'Phù hợp doanh nhân, đưa đón'],
    cons: ['Giá và chi phí dịch vụ cao', 'Cảm giác lái thiên về êm, ít thể thao', 'Công nghệ phức tạp, dễ lỗi vặt'],
  },
  'mercedes-glc': {
    pros: ['SUV sang bán chạy, giữ giá tốt', 'Nội thất đẹp, cách âm tốt', 'Vận hành êm ái, tiện nghi'],
    cons: ['Giá bản cao đắt', 'Chi phí bảo dưỡng cao', 'Cốp và ghế sau ở mức vừa phải'],
  },
  // ===== BMW =====
  'bmw-3series': {
    pros: ['Cảm giác lái thể thao hàng đầu phân khúc', 'Động cơ mạnh, hộp số mượt', 'Nội thất hiện đại, hướng người lái'],
    cons: ['Giảm xóc hơi cứng, thiên thể thao', 'Chi phí bảo dưỡng cao', 'Ghế sau hẹp'],
  },
  'bmw-5series': {
    pros: ['Cân bằng giữa lái thể thao và êm ái', 'Nội thất sang, công nghệ đỉnh', 'Động cơ mạnh mẽ'],
    cons: ['Giá và phí dịch vụ cao', 'Tùy chọn nâng cấp đắt', 'Cảm giác lái số hóa hơn đời cũ'],
  },
  'bmw-x3': {
    pros: ['Lái thể thao nhất nhóm SUV hạng sang C', 'Động cơ mạnh, phản ứng nhanh', 'Nội thất chất lượng cao'],
    cons: ['Giảm xóc hơi chắc', 'Chi phí nuôi xe cao', 'Tùy chọn thêm đắt đỏ'],
  },
  // ===== Audi =====
  'audi-a4': {
    pros: ['Nội thất tinh tế, công nghệ đẹp mắt', 'Vận hành cân bằng, êm ái', 'Cách âm tốt'],
    cons: ['Cảm giác lái ít phấn khích hơn BMW', 'Giá phụ tùng cao', 'Cập nhật mẫu mã chậm tại VN'],
  },
  'audi-q5': {
    pros: ['Nội thất sang trọng, lắp ráp kỹ', 'Quattro vận hành chắc chắn', 'Êm ái, tiện nghi cao'],
    cons: ['Chi phí bảo dưỡng đắt', 'Khoang chứa vừa phải', 'Công nghệ giải trí cần làm quen'],
  },
  // ===== Volvo =====
  'volvo-xc40': {
    pros: ['An toàn hàng đầu, nhiều trang bị', 'Thiết kế Bắc Âu tinh tế', 'Bản hybrid tiết kiệm'],
    cons: ['Giá cao so với cỡ xe', 'Hệ thống Android phải làm quen', 'Mạng lưới dịch vụ còn ít'],
  },
  'volvo-xc60': {
    pros: ['Cực kỳ an toàn, êm ái', 'Nội thất sang, tối giản đẹp', 'Hybrid mạnh và tiết kiệm'],
    cons: ['Giá và chi phí dịch vụ cao', 'Cảm giác lái thiên êm', 'Ít đại lý so với Đức'],
  },
  // ===== Lexus =====
  'lexus-es': {
    pros: ['Êm ái và yên tĩnh bậc thầy', 'Độ tin cậy cao, ít hỏng vặt', 'Dịch vụ hậu mãi chu đáo'],
    cons: ['Cảm giác lái nhạt, thiên thoải mái', 'Hệ thống giải trí chưa thật hiện đại', 'Giá cao'],
  },
  'lexus-rx': {
    pros: ['Sang trọng, bền bỉ, giữ giá tốt', 'Cách âm và tiện nghi xuất sắc', 'Hậu mãi tin cậy'],
    cons: ['Giá bán cao', 'Thiết kế nội thất hơi bảo thủ', 'Hàng ghế sau không quá rộng'],
  },
  'lexus-nx': {
    pros: ['Bản hybrid mượt, tiết kiệm', 'Nội thất hoàn thiện cao cấp', 'Bền bỉ, giữ giá'],
    cons: ['Giá cao trong nhóm SUV hạng sang C', 'Cốp vừa phải', 'Cảm giác lái êm, ít hứng khởi'],
  },
  // ===== MINI =====
  'mini-hatch': {
    pros: ['Cảm giác lái go-kart vui nhộn', 'Thiết kế cá tính, dễ thương', 'Cá nhân hóa phong phú'],
    cons: ['Cabin và cốp nhỏ', 'Giảm xóc cứng, hơi xóc', 'Giá cao so với kích cỡ'],
  },
  'mini-countryman': {
    pros: ['Thực dụng hơn nhưng vẫn vui khi lái', 'Nội thất cá tính, chất lượng tốt', 'Trang bị hiện đại'],
    cons: ['Giá cao', 'Chi phí bảo dưỡng đắt', 'Một số tùy chọn phải mua thêm'],
  },
  // ===== Volkswagen =====
  'vw-virtus': {
    pros: ['Khung gầm Đức chắc chắn, đầm chắc', 'Máy 1.0 turbo bốc và tiết kiệm', 'An toàn tốt'],
    cons: ['Thương hiệu kén khách tại VN', 'Giữ giá kém xe Nhật/Hàn', 'Trang bị giải trí đơn giản'],
  },
  'vw-tiguan': {
    pros: ['Khung gầm chắc chắn, lái đầm', 'Máy 2.0 turbo mạnh mẽ', 'Tùy chọn 7 chỗ thực dụng'],
    cons: ['Giá cao, giữ giá kém', 'Chi phí phụ tùng đắt', 'Mạng lưới dịch vụ mỏng'],
  },
  'vw-touareg': {
    pros: ['SUV Đức bề thế, vận hành sang', 'Máy V6 mạnh, cách âm tốt', 'Trang bị tiện nghi cao cấp'],
    cons: ['Giá và chi phí nuôi rất cao', 'Thanh khoản bán lại thấp', 'Ít đại lý hỗ trợ'],
  },
  // ===== Peugeot =====
  'peugeot-2008': {
    pros: ['Thiết kế Pháp đẹp, nội thất i-Cockpit lạ mắt', 'Trang bị nhiều so với giá', 'Lái đầm chắc'],
    cons: ['Vô-lăng nhỏ kén tư thế lái', 'Giữ giá kém', 'Mạng lưới dịch vụ hạn chế'],
  },
  'peugeot-3008': {
    pros: ['Nội thất sang và độc đáo', 'Thiết kế nổi bật', 'Vận hành êm, chắc chắn'],
    cons: ['Giữ giá thấp', 'Phụ tùng đắt và lâu', 'Hộp số đôi lúc hơi giật ở tốc độ thấp'],
  },
  'peugeot-5008': {
    pros: ['7 chỗ với nội thất sang trọng', 'Thiết kế cuốn hút', 'Trang bị tiện nghi đầy đủ'],
    cons: ['Hàng ghế 3 chật', 'Giữ giá kém, phụ tùng đắt', 'Máy 1.6 turbo vừa đủ khi đủ tải'],
  },
  // ===== Tesla =====
  'tesla-model3': {
    pros: ['Hiệu năng và tăng tốc ấn tượng', 'Phần mềm và Autopilot dẫn đầu', 'Chi phí sạc thấp, công nghệ cập nhật OTA'],
    cons: ['Nội thất tối giản đến mức thiếu nút bấm', 'Chưa có hệ thống sạc chính hãng tại VN', 'Chất lượng lắp ráp đôi chỗ chưa đều'],
  },
  'tesla-modely': {
    pros: ['Không gian rộng, cốp lớn', 'Tăng tốc mạnh, lái phấn khích', 'Hệ sinh thái phần mềm vượt trội'],
    cons: ['Giảm xóc hơi cứng', 'Hạ tầng sạc tại VN còn hạn chế', 'Hoàn thiện chi tiết chưa hoàn hảo'],
  },
  // ===== BYD =====
  'byd-atto3': {
    pros: ['Pin Blade an toàn, bền', 'Trang bị phong phú so với giá', 'Vận hành êm, nội thất sáng tạo'],
    cons: ['Thiết kế nội thất kén người', 'Hạ tầng sạc và dịch vụ còn mới', 'Quãng đường thực tế thấp hơn công bố'],
  },
  'byd-dolphin': {
    pros: ['Giá dễ tiếp cận cho xe điện', 'Nhỏ gọn, hợp đi phố', 'Chi phí sử dụng thấp'],
    cons: ['Công suất khiêm tốn', 'Quãng đường vừa phải', 'Mạng lưới sạc còn hạn chế'],
  },
  'byd-seal': {
    pros: ['Thiết kế đẹp, khí động học tốt', 'Tăng tốc mạnh, lái cân bằng', 'Pin Blade an toàn, sạc nhanh'],
    cons: ['Phần mềm cần hoàn thiện thêm', 'Dịch vụ hậu mãi còn mới tại VN', 'Tiêu hao điện tăng ở tốc độ cao'],
  },
  // ===== VinFast =====
  'vinfast-vf3': {
    pros: ['Giá rẻ, hợp xe điện đầu tiên', 'Nhỏ gọn cực kỳ linh hoạt trong phố', 'Kiểu dáng cá tính, dễ thương'],
    cons: ['Chỉ 4 chỗ, cốp nhỏ', 'Quãng đường ngắn', 'Trang bị an toàn cơ bản'],
  },
  'vinfast-vf5': {
    pros: ['Giá tốt, ưu đãi sạc hấp dẫn', 'Gầm cao, hợp đô thị', 'Bảo hành dài, mạng lưới sạc rộng'],
    cons: ['Cách âm và vật liệu cơ bản', 'Quãng đường vừa phải', 'Phần mềm còn cập nhật'],
  },
  'vinfast-vf6': {
    pros: ['Trang bị ADAS khá đầy đủ', 'Không gian hợp gia đình nhỏ', 'Hệ thống sạc VinFast thuận tiện'],
    cons: ['Tiêu hao điện chưa tối ưu', 'Một số tính năng phần mềm chưa mượt', 'Cách âm ở mức trung bình'],
  },
  'vinfast-vf7-eco': {
    pros: ['Thiết kế đẹp, hiện đại', 'Trang bị tiện nghi tốt so với giá', 'Bảo hành dài, sạc rộng khắp'],
    cons: ['Bản Eco công suất vừa phải', 'Phần mềm còn đang hoàn thiện', 'Quãng đường thực tế thấp hơn công bố'],
  },
  'vinfast-vf7-plus': {
    pros: ['Hai mô-tơ tăng tốc mạnh', 'Trang bị cao cấp, ADAS đầy đủ', 'Thiết kế thể thao bắt mắt'],
    cons: ['Tiêu hao điện cao khi chạy nhanh', 'Phần mềm cần cập nhật thêm', 'Giá nhỉnh so với bản Eco'],
  },
  'vinfast-ec-van': {
    pros: ['Chi phí vận hành rất thấp', 'Hợp giao hàng nội đô', 'Dễ luồn lách, đỗ gọn'],
    cons: ['Chỉ 2 chỗ, thuần chở hàng', 'Quãng đường giới hạn', 'Tiện nghi tối giản'],
  },
  'vinfast-minio-green': {
    pros: ['Giá rẻ nhất nhóm xe điện', 'Cực kỳ nhỏ gọn cho phố đông', 'Chi phí sạc gần như không đáng kể'],
    cons: ['Công suất rất thấp, chỉ hợp nội đô', 'Quãng đường ngắn', 'Trang bị tối thiểu'],
  },
  'vinfast-herio-green': {
    pros: ['Hợp chạy dịch vụ taxi điện', 'Chi phí vận hành thấp', 'Gầm cao, bền cho khai thác liên tục'],
    cons: ['Tiện nghi hướng dịch vụ, đơn giản', 'Quãng đường vừa phải', 'Cách âm cơ bản'],
  },
  'vinfast-nerio-green': {
    pros: ['Khoang rộng hợp chạy taxi', 'Chi phí điện thấp', 'Mạng lưới sạc thuận tiện'],
    cons: ['Nội thất thiên khai thác dịch vụ', 'Trang bị cơ bản', 'Quãng đường thực tế khiêm tốn'],
  },
  'vinfast-limo-green': {
    pros: ['MPV 7 chỗ điện rộng rãi', 'Chi phí nuôi rất thấp cho dịch vụ', 'Vận hành êm, không khí thải'],
    cons: ['Hướng dịch vụ nên tiện nghi vừa phải', 'Quãng đường cần tính toán cho đường dài', 'Phụ thuộc trạm sạc'],
  },
  'vinfast-vf8': {
    pros: ['Tăng tốc rất mạnh', 'Trang bị công nghệ và ADAS hiện đại', 'Bảo hành dài, mạng lưới sạc rộng'],
    cons: ['Phần mềm vẫn đang được cập nhật', 'Tiêu hao điện cao ở tốc độ cao', 'Giảm xóc trên đời đầu hơi cứng'],
  },
  'vinfast-vf9': {
    pros: ['Cabin 7 chỗ rất rộng, sang', 'Hai mô-tơ mạnh mẽ, êm ái', 'Trang bị cao cấp, ADAS đầy đủ'],
    cons: ['Quãng đường giảm nhiều khi đủ tải', 'Thân xe lớn khó xoay trở', 'Phần mềm cần hoàn thiện'],
  },
  // ===== Toyota (nhóm 2) =====
  'toyota-wigo': {
    pros: ['Giá rẻ, nuôi xe tiết kiệm', 'Nhỏ gọn dễ lái và đỗ', 'Bền, giữ giá'],
    cons: ['Máy 1.2 yếu', 'Cách âm và trang bị cơ bản', 'Đi đường trường hơi ồn'],
  },
  'toyota-raize': {
    pros: ['Nhỏ gọn, gầm cao linh hoạt', 'Tiết kiệm nhiên liệu', 'Thiết kế trẻ trung'],
    cons: ['Máy 1.0 turbo nhỏ, đuối khi đủ tải', 'Cách âm trung bình', 'Cốp nhỏ'],
  },
  'toyota-corolla-altis': {
    pros: ['Hybrid êm và tiết kiệm', 'An toàn TSS đầy đủ', 'Bền bỉ, giữ giá tốt'],
    cons: ['Thiết kế hiền, kén người trẻ', 'Giá cao trong hạng C', 'Cách âm gầm chưa tốt'],
  },
  'toyota-veloz-cross': {
    pros: ['MPV 7 chỗ giá hợp lý', 'Tiết kiệm nhiên liệu, bền', 'Trang bị an toàn khá so với giá'],
    cons: ['Máy 1.5 yếu khi đủ tải', 'Cách âm kém', 'Vật liệu nội thất bình thường'],
  },
  'toyota-avanza': {
    pros: ['Giá mềm, nuôi xe rẻ', '7 chỗ thực dụng cho gia đình', 'Bền, dễ bảo dưỡng'],
    cons: ['Máy yếu, tăng tốc chậm', 'Trang bị tối giản', 'Cách âm và vật liệu cơ bản'],
  },
  'toyota-prado': {
    pros: ['Bền bỉ, off-road tốt', 'Giữ giá rất cao', 'Bệ vệ, sang trọng vừa đủ'],
    cons: ['Giá cao, khan hàng', 'Hao xăng', 'Công nghệ giải trí chưa hiện đại'],
  },
  'toyota-land-cruiser': {
    pros: ['Bền bỉ và off-road đỉnh cao', 'Giữ giá cực tốt, thanh khoản cao', 'Bệ vệ, sang trọng, đa địa hình'],
    cons: ['Giá rất cao, hay bán chênh', 'Hao nhiên liệu', 'Thân xe lớn khó đỗ phố'],
  },
  'toyota-alphard': {
    pros: ['MPV hạng sang êm như khoang VIP', 'Ghế thương gia chỉnh điện sang trọng', 'Hybrid tiết kiệm, giữ giá cao'],
    cons: ['Giá rất cao, thường bán chênh', 'Thân xe to khó xoay trong phố', 'Cảm giác lái không thể thao'],
  },
  // ===== Honda (nhóm 2) =====
  'honda-wrv': {
    pros: ['Gầm cao thoáng, cabin rộng', 'Vận hành ổn, máy bền', 'Trang bị an toàn Honda Sensing'],
    cons: ['Máy 1.5 hút khí yếu', 'Cách âm trung bình', 'Giá cao so với cỡ B'],
  },
  'honda-brv': {
    pros: ['MPV 7 chỗ gầm cao thực dụng', 'An toàn Honda Sensing đầy đủ', 'Cảm giác lái chắc chắn'],
    cons: ['Máy 1.5 yếu khi đủ tải', 'Cách âm chưa tốt', 'Hàng ghế 3 hợp trẻ em'],
  },
  // ===== Hyundai (nhóm 2) =====
  'hyundai-grand-i10': {
    pros: ['Giá rẻ, nuôi xe tiết kiệm', 'Nhỏ gọn dễ lái phố', 'Cabin rộng so với cỡ A'],
    cons: ['Máy yếu, cách âm kém', 'Nhựa nội thất rẻ', 'Giữ giá thua Morning một chút'],
  },
  'hyundai-venue': {
    pros: ['Nhỏ gọn, nhiều trang bị', 'Thiết kế vuông vắn trẻ trung', 'Giá hợp lý'],
    cons: ['Máy 1.0 turbo nhỏ', 'Cốp nhỏ', 'Cách âm cơ bản'],
  },
  'hyundai-elantra': {
    pros: ['Thiết kế thể thao, sắc sảo', 'Trang bị nhiều, giá tốt', 'Cabin rộng'],
    cons: ['Máy 1.6 vừa đủ', 'Cách âm trung bình', 'Giữ giá kém xe Nhật'],
  },
  'hyundai-stargazer': {
    pros: ['MPV giá tốt, trang bị nhiều', 'Khoang cabin cao thoáng', 'Tiết kiệm nhiên liệu'],
    cons: ['Máy 1.5 yếu', 'Kiểu dáng kén khách', 'Cách âm cơ bản'],
  },
  'hyundai-custin': {
    pros: ['MPV gia đình rộng, hiện đại', 'Trang bị công nghệ phong phú', 'Vận hành êm ái'],
    cons: ['Thương hiệu MPV còn mới', 'Giữ giá chưa rõ ràng', 'Máy 1.5 turbo vừa đủ khi đủ tải'],
  },
  'hyundai-ioniq5': {
    pros: ['Thiết kế retro độc đáo', 'Sạc 800V cực nhanh', 'Cabin rộng, sàn phẳng tiện nghi'],
    cons: ['Giá cao', 'Hạ tầng sạc nhanh tại VN còn ít', 'Quãng đường giảm khi chạy cao tốc'],
  },
  // ===== Kia (nhóm 2) =====
  'kia-morning': {
    pros: ['Giá rẻ, dễ nuôi', 'Nhỏ gọn, bán kính quay vòng nhỏ', 'Trang bị khá so với cỡ A'],
    cons: ['Máy yếu, đi đường trường ồn', 'Cách âm kém', 'Khoang chứa nhỏ'],
  },
  'kia-k3': {
    pros: ['Thiết kế đẹp, trẻ trung', 'Trang bị nhiều so với giá', 'Cabin rộng rãi'],
    cons: ['Máy 1.6 vừa đủ', 'Cách âm trung bình', 'Giữ giá kém'],
  },
  'kia-k5': {
    pros: ['Thiết kế thể thao bắt mắt', 'Trang bị phong phú, giá tốt', 'Cabin rộng và tiện nghi'],
    cons: ['Bản 2.0 hơi đuối', 'Giữ giá kém Camry', 'Cách âm chưa tương xứng'],
  },
  'kia-carens': {
    pros: ['MPV 7 chỗ nhiều trang bị, giá tốt', 'Thiết kế giống SUV trẻ trung', 'Cabin linh hoạt'],
    cons: ['Hàng ghế 3 chật', 'Máy vừa đủ khi đủ tải', 'Cách âm trung bình'],
  },
  'kia-ev5': {
    pros: ['Xe điện cỡ C giá hợp lý', 'Cabin rộng, vuông vức tiện dụng', 'Trang bị công nghệ tốt'],
    cons: ['Quãng đường thực tế chưa nổi bật', 'Hạ tầng sạc còn hạn chế', 'Hậu mãi EV còn mới'],
  },
  'kia-ev9': {
    pros: ['SUV điện 7 chỗ rất rộng', 'Thiết kế hầm hố, hiện đại', 'Trang bị cao cấp, sạc nhanh'],
    cons: ['Giá cao', 'Tiêu hao điện lớn do thân xe to', 'Hạ tầng sạc nhanh tại VN còn ít'],
  },
  // ===== Mazda (nhóm 2) =====
  'mazda-cx3': {
    pros: ['Thiết kế đẹp, nội thất chỉn chu', 'Lái chắc chắn', 'Tiết kiệm nhiên liệu'],
    cons: ['Khoang sau và cốp nhỏ', 'Máy 1.5 yếu', 'Giá cao so với cỡ xe'],
  },
  'mazda-cx30': {
    pros: ['Thiết kế sang trọng, cao cấp', 'Cảm giác lái tốt', 'Trang bị an toàn i-Activsense'],
    cons: ['Cabin sau và cốp hẹp', 'Máy 2.0 vừa đủ', 'Giá nhỉnh so với cỡ B'],
  },
  'mazda-cx60': {
    pros: ['Nền tảng dẫn động cầu sau cao cấp', 'Nội thất sang, vật liệu tốt', 'Lái cân bằng, đầm chắc'],
    cons: ['Hộp số đôi lúc giật ở tốc độ thấp', 'Giá cao', 'Khoang sau vừa phải'],
  },
  'mazda-bt50': {
    pros: ['Chung khung gầm bền bỉ với D-Max', 'Máy dầu tiết kiệm', 'Nội thất đẹp hơn nhiều bán tải'],
    cons: ['Doanh số thấp nên giữ giá kém', 'Off-road không bằng Ranger', 'Tăng tốc bình thường'],
  },
  // ===== Mitsubishi attrage =====
  'mitsubishi-attrage': {
    pros: ['Tiết kiệm nhiên liệu hàng đầu', 'Giá rẻ, dễ nuôi', 'Khoang cabin và cốp rộng bất ngờ'],
    cons: ['Máy 1.2 rất yếu', 'Nội thất nhựa rẻ, cách âm kém', 'Cảm giác lái nhẹ và nhạt'],
  },
  // ===== Ford (nhóm 2) =====
  'ford-territory': {
    pros: ['Trang bị công nghệ rất nhiều so với giá', 'Cabin rộng, màn hình lớn', 'Thiết kế hiện đại'],
    cons: ['Có nguồn gốc liên doanh Trung Quốc, kén khách', 'Giữ giá chưa rõ', 'Cách âm trung bình'],
  },
  'ford-explorer': {
    pros: ['SUV 7 chỗ cỡ lớn bệ vệ', 'Động cơ EcoBoost mạnh mẽ', 'Trang bị tiện nghi đầy đủ'],
    cons: ['Hao xăng', 'Thân xe lớn khó đỗ', 'Chi phí phụ tùng cao'],
  },
  'ford-transit': {
    pros: ['Không gian chở khách lớn', 'Bền bỉ, hợp kinh doanh vận tải', 'Chi phí khai thác hợp lý'],
    cons: ['Lái như xe tải, cồng kềnh', 'Tiện nghi cơ bản', 'Ồn và xóc khi chạy không tải'],
  },
  // ===== Nissan terra =====
  'nissan-terra': {
    pros: ['Cabin rộng, ghế êm', 'Máy dầu twin-turbo khỏe', 'Trang bị ProPILOT hỗ trợ lái'],
    cons: ['Giữ giá kém Everest/Fortuner', 'Mạng lưới dịch vụ mỏng', 'Hao dầu khi chạy phố'],
  },
  // ===== Suzuki (nhóm 2) =====
  'suzuki-ertiga': {
    pros: ['MPV 7 chỗ giá rẻ, tiết kiệm', 'Mild-hybrid uống xăng ít', 'Nhẹ, dễ lái, bền'],
    cons: ['Máy 1.5 yếu khi đủ tải', 'Cách âm và vật liệu cơ bản', 'An toàn ở mức tối thiểu'],
  },
  'suzuki-fronx': {
    pros: ['Thiết kế coupe SUV trẻ trung', 'Tiết kiệm nhiên liệu', 'Nhỏ gọn, dễ lái'],
    cons: ['Máy 1.5 hút khí yếu', 'Cốp nhỏ', 'Trang bị an toàn cơ bản'],
  },
  // ===== Subaru WRX =====
  'subaru-wrx': {
    pros: ['Máy boxer turbo và AWD bám đường cực tốt', 'Cảm giác lái thể thao đỉnh', 'Cá tính rally đặc trưng'],
    cons: ['Hao xăng', 'Nội thất đơn giản so với giá', 'Giảm xóc cứng, ồn khi đi phố'],
  },
  // ===== Peugeot (nhóm 2) =====
  'peugeot-408': {
    pros: ['Thiết kế fastback độc đáo, đẹp', 'Nội thất i-Cockpit sang trọng', 'Trang bị nhiều'],
    cons: ['Giữ giá kém', 'Phụ tùng đắt và chờ lâu', 'Vô-lăng nhỏ kén tư thế'],
  },
  'peugeot-traveller': {
    pros: ['MPV cao cấp, khoang VIP rộng', 'Cách âm tốt, êm ái', 'Hợp đưa đón doanh nhân'],
    cons: ['Giá cao', 'Phụ tùng đắt, ít đại lý', 'Thân xe dài khó xoay trở'],
  },
  // ===== VW (nhóm 2) =====
  'vw-teramont': {
    pros: ['SUV 7 chỗ cỡ lớn rất rộng', 'Máy 2.0 turbo mạnh', 'Đầm chắc, an toàn'],
    cons: ['Hao xăng, thân xe to', 'Giữ giá kém', 'Chi phí phụ tùng cao'],
  },
  'vw-viloran': {
    pros: ['MPV hạng sang khoang sau cực rộng', 'Ghế thương gia êm ái', 'Cách âm tốt, sang trọng'],
    cons: ['Giá cao', 'Giữ giá kém Alphard', 'Mạng lưới dịch vụ mỏng'],
  },
  // ===== Acura / Infiniti =====
  'acura-integra': {
    pros: ['Cảm giác lái thể thao, máy turbo bốc', 'Nội thất cao cấp', 'Hiếm và cá tính'],
    cons: ['Nhập khẩu, hậu mãi hạn chế tại VN', 'Giữ giá khó đoán', 'Giá cao so với nền tảng Civic'],
  },
  'acura-mdx': {
    pros: ['SUV 7 chỗ sang, vận hành tốt', 'Trang bị cao cấp', 'Cách âm và tiện nghi tốt'],
    cons: ['Hậu mãi hạn chế tại VN', 'Hao xăng', 'Thanh khoản bán lại thấp'],
  },
  'infiniti-qx60': {
    pros: ['Nội thất sang, ghế êm', 'Cabin 7 chỗ rộng', 'Vận hành mượt mà'],
    cons: ['Hãng gần như vắng bóng tại VN', 'Phụ tùng khó, hao xăng', 'Giữ giá thấp'],
  },
  'infiniti-q50': {
    pros: ['Máy V6 twin-turbo rất mạnh', 'Thiết kế thể thao đẹp', 'Giá hời cho hiệu năng'],
    cons: ['Hậu mãi hạn chế', 'Hao xăng', 'Công nghệ giải trí lỗi thời'],
  },
  // ===== Daihatsu =====
  'daihatsu-rocky': {
    pros: ['Nhỏ gọn, tiết kiệm', 'Gầm cao linh hoạt', 'Giá hợp lý'],
    cons: ['Chưa phân phối rộng tại VN', 'Máy nhỏ, cách âm cơ bản', 'Trang bị an toàn vừa phải'],
  },
  'daihatsu-terios': {
    pros: ['SUV 7 chỗ nhỏ giá mềm', 'Bền, tiết kiệm', 'Gầm cao thực dụng'],
    cons: ['Hàng ghế 3 rất chật', 'Máy yếu', 'Cách âm và tiện nghi cơ bản'],
  },
  // ===== Genesis =====
  'genesis-g80': {
    pros: ['Sang trọng, nhiều trang bị hơn xe Đức cùng giá', 'Cách âm và êm ái tốt', 'Thiết kế lịch lãm'],
    cons: ['Thương hiệu chưa phổ biến tại VN', 'Giữ giá khó đoán', 'Mạng lưới dịch vụ ít'],
  },
  'genesis-gv80': {
    pros: ['SUV sang bề thế, nội thất đẹp', 'Trang bị cực kỳ phong phú', 'Vận hành êm ái'],
    cons: ['Thương hiệu mới, thanh khoản thấp', 'Hao xăng', 'Ít đại lý hỗ trợ'],
  },
  // ===== Porsche =====
  'porsche-911': {
    pros: ['Biểu tượng xe thể thao, lái xuất sắc', 'Động cơ boxer mạnh mẽ, âm thanh phấn khích', 'Chất lượng hoàn thiện đỉnh cao, giữ giá tốt'],
    cons: ['Giá rất cao, tùy chọn đắt đỏ', 'Hàng ghế sau chỉ mang tính tượng trưng', 'Chi phí bảo dưỡng lớn'],
  },
  'porsche-cayenne': {
    pros: ['SUV lái thể thao nhất phân khúc', 'Nội thất sang, công nghệ cao', 'Động cơ mạnh mẽ'],
    cons: ['Giá và tùy chọn rất đắt', 'Hao xăng', 'Chi phí nuôi xe cao'],
  },
  'porsche-macan': {
    pros: ['Cảm giác lái thể thao tuyệt vời', 'Nội thất cao cấp', 'Giữ giá tốt trong nhóm xe sang'],
    cons: ['Khoang sau và cốp khiêm tốn', 'Nhiều trang bị phải mua thêm', 'Chi phí bảo dưỡng cao'],
  },
  'porsche-taycan': {
    pros: ['Xe điện lái thể thao đúng chất Porsche', 'Sạc 800V cực nhanh', 'Hoàn thiện và công nghệ đỉnh'],
    cons: ['Giá rất cao', 'Quãng đường khiêm tốn khi lái hăng', 'Hạ tầng sạc tốc độ cao tại VN hạn chế'],
  },
  // ===== Opel =====
  'opel-astra': {
    pros: ['Thiết kế Đức gọn gàng, hiện đại', 'Trang bị khá, lái chắc chắn', 'Tiết kiệm nhiên liệu'],
    cons: ['Thương hiệu mới trở lại, kén khách', 'Mạng lưới dịch vụ ít', 'Giữ giá chưa rõ'],
  },
  'opel-mokka': {
    pros: ['Thiết kế trẻ trung, cá tính', 'Nhỏ gọn dễ lái', 'Trang bị hiện đại'],
    cons: ['Thương hiệu chưa phổ biến', 'Cốp nhỏ', 'Hậu mãi còn hạn chế'],
  },
  // ===== GMC / Cadillac =====
  'gmc-yukon': {
    pros: ['SUV cỡ lớn cực kỳ rộng rãi', 'Động cơ V8 mạnh, kéo khỏe', 'Tiện nghi và bệ vệ'],
    cons: ['Rất hao xăng', 'Thân xe khổng lồ khó đỗ', 'Xe nhập tư nhân, hậu mãi hạn chế'],
  },
  'gmc-sierra': {
    pros: ['Bán tải full-size mạnh mẽ, kéo cực khỏe', 'Cabin rộng và tiện nghi', 'Bệ vệ, cá tính'],
    cons: ['Kích thước quá lớn cho đường VN', 'Rất hao xăng', 'Phụ tùng và dịch vụ khó'],
  },
  'cadillac-escalade': {
    pros: ['SUV Mỹ cỡ lớn xa hoa', 'Màn hình OLED cong ấn tượng', 'Động cơ V8 mạnh, cabin im lặng'],
    cons: ['Cực kỳ hao xăng', 'Thân xe quá khổ', 'Hậu mãi tại VN rất hạn chế'],
  },
  'cadillac-lyriq': {
    pros: ['SUV điện sang, thiết kế ấn tượng', 'Cabin rộng, yên tĩnh', 'Trang bị công nghệ cao'],
    cons: ['Thương hiệu EV mới, hậu mãi hạn chế', 'Hạ tầng sạc phù hợp còn ít', 'Thanh khoản thấp'],
  },
  // ===== Jeep / RAM / Dodge / Chrysler =====
  'jeep-wrangler': {
    pros: ['Khả năng off-road huyền thoại', 'Cá tính không lẫn vào đâu', 'Mui và cửa tháo rời vui nhộn'],
    cons: ['Lái trên đường nhựa ồn và xóc', 'Hao xăng', 'Cách âm kém'],
  },
  'jeep-grand-cherokee': {
    pros: ['Cân bằng giữa off-road và sang trọng', 'Nội thất cao cấp, tiện nghi', 'Động cơ mạnh'],
    cons: ['Hao xăng', 'Phụ tùng và dịch vụ hạn chế tại VN', 'Giữ giá thấp'],
  },
  'ram-1500': {
    pros: ['Bán tải full-size êm ái nhờ treo khí nén', 'Cabin rộng và sang', 'Động cơ V8 mạnh mẽ'],
    cons: ['Kích thước quá khổ', 'Hao xăng', 'Phụ tùng khó, nhập tư nhân'],
  },
  'dodge-durango': {
    pros: ['SUV 7 chỗ cơ bắp, máy mạnh', 'Cá tính thể thao Mỹ', 'Kéo tải tốt'],
    cons: ['Hao xăng', 'Nội thất kém tinh tế', 'Hậu mãi hạn chế'],
  },
  'dodge-challenger': {
    pros: ['Coupe cơ bắp Mỹ V8 mạnh mẽ, âm thanh đã tai', 'Thiết kế retro cá tính', 'Cabin rộng so với coupe'],
    cons: ['Rất hao xăng', 'Lái nặng nề, không nhanh nhẹn', 'Hậu mãi và phụ tùng khó'],
  },
  'chrysler-pacifica': {
    pros: ['Minivan tiện nghi, ghế Stow-n-Go linh hoạt', 'Êm ái, rộng rãi', 'Phù hợp gia đình đông'],
    cons: ['Hãng vắng bóng tại VN', 'Hao xăng', 'Phụ tùng khó tìm'],
  },
  // ===== Lincoln =====
  'lincoln-navigator': {
    pros: ['SUV cỡ lớn sang trọng kiểu Mỹ', 'Cabin yên tĩnh, ghế cực êm', 'Trang bị xa hoa'],
    cons: ['Rất hao xăng', 'Thân xe khổng lồ', 'Hậu mãi tại VN hạn chế'],
  },
  'lincoln-aviator': {
    pros: ['Nội thất sang, êm ái', 'Động cơ mạnh mẽ', '7 chỗ rộng rãi'],
    cons: ['Hao xăng', 'Ít đại lý hỗ trợ', 'Giữ giá thấp'],
  },
  // ===== Land Rover / Range Rover =====
  'land-rover-defender': {
    pros: ['Off-road đỉnh cao kèm sang trọng hiện đại', 'Thiết kế biểu tượng, cá tính', 'Đa địa hình ấn tượng'],
    cons: ['Độ tin cậy điện tử đáng lo', 'Chi phí bảo dưỡng rất cao', 'Hao xăng'],
  },
  'land-rover-discovery': {
    pros: ['SUV 7 chỗ đa dụng, off-road tốt', 'Cabin linh hoạt, tiện nghi', 'Vận hành sang trọng'],
    cons: ['Hay gặp lỗi điện tử', 'Chi phí dịch vụ cao', 'Giữ giá thấp'],
  },
  'range-rover-evoque': {
    pros: ['Thiết kế thời trang, đẹp mắt', 'Nội thất sang, tinh tế', 'Off-road nhẹ tốt hơn vẻ ngoài'],
    cons: ['Độ tin cậy chưa cao', 'Khoang sau và cốp nhỏ', 'Chi phí bảo dưỡng đắt'],
  },
  'range-rover-sport': {
    pros: ['Kết hợp sang trọng và thể thao', 'Off-road mạnh kèm tiện nghi đỉnh', 'Động cơ mạnh, vận hành uy lực'],
    cons: ['Chi phí bảo dưỡng rất cao', 'Lo ngại độ tin cậy điện tử', 'Hao xăng'],
  },
  'range-rover-autobiography': {
    pros: ['Đỉnh cao SUV siêu sang, êm như khoang VIP', 'Cách âm và tiện nghi tuyệt hảo', 'Bệ vệ, đẳng cấp'],
    cons: ['Giá và chi phí nuôi cực cao', 'Độ tin cậy điện tử là điểm lo', 'Hao nhiên liệu'],
  },
  // ===== Jaguar =====
  'jaguar-f-pace': {
    pros: ['Thiết kế đẹp, lái thể thao', 'Nội thất sang, cá tính Anh quốc', 'Động cơ mạnh'],
    cons: ['Độ tin cậy trung bình', 'Giữ giá thấp', 'Chi phí dịch vụ cao'],
  },
  'jaguar-f-type': {
    pros: ['Thiết kế coupe tuyệt đẹp', 'Âm thanh động cơ phấn khích', 'Cảm giác lái thể thao'],
    cons: ['Cabin chật, cốp nhỏ', 'Hao xăng', 'Giữ giá kém, hậu mãi hạn chế'],
  },
  // ===== Bentley =====
  'bentley-bentayga': {
    pros: ['SUV siêu sang thủ công tinh xảo', 'Êm ái, mạnh mẽ, tiện nghi đỉnh', 'Đẳng cấp và cá nhân hóa cao'],
    cons: ['Giá và chi phí nuôi cực lớn', 'Hao xăng', 'Khấu hao nhanh'],
  },
  'bentley-continental-gt': {
    pros: ['GT siêu sang, hoàn thiện thủ công tuyệt mỹ', 'Động cơ W12/V8 mạnh, êm', 'Vừa sang vừa nhanh'],
    cons: ['Giá rất cao', 'Chi phí bảo dưỡng lớn', 'Trọng lượng nặng, không nhanh nhẹn như siêu xe'],
  },
  // ===== Rolls-Royce =====
  'rolls-royce-cullinan': {
    pros: ['Đỉnh cao xa hoa, êm như thảm bay', 'Thủ công tuyệt mỹ, cá nhân hóa vô hạn', 'Hiện diện uy nghi bậc nhất'],
    cons: ['Giá trên trời, chi phí nuôi khổng lồ', 'Hao xăng', 'Quá khổ cho phố đông'],
  },
  'rolls-royce-ghost': {
    pros: ['Sedan siêu sang êm ái tuyệt đối', 'Cách âm như phòng cách ly', 'Thủ công và đẳng cấp vô song'],
    cons: ['Giá và chi phí vận hành cực cao', 'Khấu hao lớn', 'Hao nhiên liệu'],
  },
  // ===== Aston Martin =====
  'aston-martin-dbx': {
    pros: ['SUV siêu sang lái thể thao', 'Thiết kế quyến rũ, nội thất thủ công', 'Động cơ V8 mạnh mẽ'],
    cons: ['Giá rất cao', 'Hậu mãi hạn chế tại VN', 'Chi phí bảo dưỡng lớn'],
  },
  'aston-martin-vantage': {
    pros: ['Thiết kế coupe tuyệt đẹp, gợi cảm', 'Động cơ V8 AMG mạnh, âm thanh hay', 'Cảm giác lái phấn khích'],
    cons: ['Cabin chật, cốp nhỏ', 'Hao xăng', 'Hậu mãi hạn chế'],
  },
  // ===== Lotus =====
  'lotus-emira': {
    pros: ['Cảm giác lái thuần chất, vào cua xuất sắc', 'Thiết kế tuyệt đẹp', 'Nhẹ và phản hồi nhạy'],
    cons: ['Cabin chật, ít tiện nghi', 'Hậu mãi rất hạn chế', 'Tiếng ồn lớn khi đi xa'],
  },
  'lotus-eletre': {
    pros: ['SUV điện hiệu năng cực cao', 'Tăng tốc khủng khiếp', 'Nội thất công nghệ hiện đại'],
    cons: ['Giá cao', 'Quãng đường giảm nhanh khi lái hăng', 'Hậu mãi và sạc tại VN còn mới'],
  },
  // ===== McLaren =====
  'mclaren-artura': {
    pros: ['Siêu xe hybrid nhẹ, lái sắc bén', 'Tăng tốc cực mạnh', 'Công nghệ khí động và khung carbon tiên tiến'],
    cons: ['Giá rất cao', 'Cabin chật, ít tiện nghi hằng ngày', 'Hậu mãi hạn chế'],
  },
  'mclaren-750s': {
    pros: ['Hiệu năng siêu xe đỉnh cao', 'Khung carbon nhẹ, lái chính xác', 'Khí động học vượt trội'],
    cons: ['Giá cực cao', 'Không thực dụng hằng ngày', 'Chi phí bảo dưỡng và phụ tùng lớn'],
  },
  // ===== Polestar =====
  'polestar-2': {
    pros: ['Thiết kế Bắc Âu tối giản đẹp', 'Lái chắc chắn, tăng tốc tốt', 'Phần mềm Google tích hợp mượt'],
    cons: ['Quãng đường vừa phải', 'Hậu mãi và sạc tại VN hạn chế', 'Cốp và khoang sau khiêm tốn'],
  },
  'polestar-3': {
    pros: ['SUV điện sang, lái cân bằng', 'Nội thất tinh tế, công nghệ tốt', 'Tăng tốc mạnh mẽ'],
    cons: ['Giá cao', 'Hạ tầng sạc và dịch vụ còn mới', 'Tiêu hao điện lớn do thân xe to'],
  },
  // ===== Ferrari =====
  'ferrari-roma': {
    pros: ['GT Ferrari thanh lịch, đẹp mê hoặc', 'Động cơ V8 twin-turbo bốc và hay', 'Cân bằng giữa sang và thể thao'],
    cons: ['Giá rất cao', 'Tùy chọn đắt đỏ', 'Hàng ghế sau chỉ tượng trưng'],
  },
  'ferrari-purosangue': {
    pros: ['SUV đầu tiên của Ferrari, V12 hút khí đỉnh cao', 'Lái thể thao đáng kinh ngạc cho một SUV', 'Cửa mở ngược độc đáo, nội thất thủ công'],
    cons: ['Giá cực kỳ cao và khan hiếm', 'Hao xăng', 'Không gian thực dụng vừa phải so với kích cỡ'],
  },
  // ===== Lamborghini =====
  'lamborghini-urus': {
    pros: ['SUV siêu xe tăng tốc khủng', 'Thiết kế hầm hố, cá tính', 'Vừa thực dụng vừa kịch tính'],
    cons: ['Giá rất cao', 'Rất hao xăng', 'Chi phí bảo dưỡng lớn'],
  },
  'lamborghini-revuelto': {
    pros: ['Hypercar V12 hybrid hơn 1000 mã lực', 'Thiết kế ngoài hành tinh', 'Hiệu năng đỉnh cao'],
    cons: ['Giá trên trời, cực hiếm', 'Không thực dụng', 'Chi phí vận hành khổng lồ'],
  },
  // ===== Maserati =====
  'maserati-grecale': {
    pros: ['Thiết kế Ý quyến rũ', 'Âm thanh động cơ phấn khích', 'Nội thất sang, cá tính'],
    cons: ['Độ tin cậy là dấu hỏi', 'Giữ giá thấp', 'Chi phí dịch vụ cao'],
  },
  'maserati-ghibli': {
    pros: ['Sedan Ý đẹp, âm thanh động cơ hay', 'Cảm giác lái thể thao', 'Cá tính khác biệt'],
    cons: ['Công nghệ đã cũ', 'Giữ giá kém', 'Hậu mãi hạn chế'],
  },
  // ===== Alfa Romeo =====
  'alfa-romeo-stelvio': {
    pros: ['SUV lái thể thao bậc nhất phân khúc', 'Thiết kế Ý đẹp, cảm giác lái phấn khích', 'Động cơ mạnh, vô-lăng nhạy'],
    cons: ['Độ tin cậy chưa cao', 'Hậu mãi hạn chế tại VN', 'Giữ giá thấp'],
  },
  'alfa-romeo-giulia': {
    pros: ['Sedan thể thao lái sướng nhất nhóm', 'Thiết kế gợi cảm', 'Cân bằng phân bổ trọng lượng tốt'],
    cons: ['Không gian sau và cốp khiêm tốn', 'Độ tin cậy là điểm lo', 'Hậu mãi ít'],
  },
  // ===== Fiat =====
  'fiat-500': {
    pros: ['Nhỏ xinh, cá tính kiểu Ý', 'Cực kỳ linh hoạt trong phố', 'Tiết kiệm nhiên liệu'],
    cons: ['Cabin và cốp rất nhỏ', 'Trang bị cơ bản', 'Hậu mãi tại VN hạn chế'],
  },
  'fiat-500x': {
    pros: ['Crossover nhỏ cá tính', 'Gầm cao, dễ lái phố', 'Thiết kế dễ thương'],
    cons: ['Máy vừa đủ', 'Hậu mãi hạn chế', 'Giữ giá thấp'],
  },
  // ===== Pagani =====
  'pagani-utopia': {
    pros: ['Hypercar thủ công nghệ thuật đỉnh cao', 'Động cơ V12 AMG mạnh mẽ', 'Cực hiếm, đẳng cấp sưu tầm'],
    cons: ['Giá thiên văn', 'Hoàn toàn không thực dụng', 'Bảo dưỡng phức tạp, hiếm có'],
  },
  // ===== Renault =====
  'renault-captur': {
    pros: ['Thiết kế Pháp trẻ trung', 'Trang bị khá, gầm cao', 'Lái đầm chắc'],
    cons: ['Thương hiệu vắng bóng tại VN', 'Phụ tùng và dịch vụ khó', 'Giữ giá thấp'],
  },
  'renault-arkana': {
    pros: ['SUV coupe lai hybrid độc đáo', 'Tiết kiệm nhiên liệu', 'Thiết kế thể thao'],
    cons: ['Hậu mãi hạn chế tại VN', 'Khoang sau dốc, hơi chật', 'Giữ giá chưa rõ'],
  },
  // ===== Citroen =====
  'citroen-c3': {
    pros: ['Cá tính, cá nhân hóa nhiều màu', 'Gầm cao, hợp đường xấu', 'Giá hợp lý'],
    cons: ['Thương hiệu mới, kén khách', 'Trang bị an toàn cơ bản', 'Hậu mãi còn ít'],
  },
  'citroen-c5-aircross': {
    pros: ['Ghế và treo cực kỳ êm ái', 'Nội thất rộng rãi, thoải mái', 'Thiết kế Pháp khác biệt'],
    cons: ['Giữ giá thấp', 'Phụ tùng đắt, ít đại lý', 'Cảm giác lái không thể thao'],
  },
  // ===== DS =====
  'ds-7': {
    pros: ['Nội thất sang trọng kiểu Pháp tinh tế', 'Trang bị công nghệ phong phú', 'Êm ái, cách âm tốt'],
    cons: ['Thương hiệu xa lạ tại VN', 'Giữ giá thấp', 'Hậu mãi hạn chế'],
  },
  'ds-3': {
    pros: ['Thiết kế thời trang, độc đáo', 'Nội thất cá tính', 'Nhỏ gọn, dễ lái'],
    cons: ['Cốp nhỏ', 'Hậu mãi hạn chế', 'Giá cao so với cỡ xe'],
  },
  // ===== Bugatti =====
  'bugatti-chiron': {
    pros: ['Hypercar W16 nhanh nhất thế giới', 'Kỹ thuật chế tác đỉnh cao', 'Biểu tượng sưu tầm vô giá'],
    cons: ['Giá thiên văn', 'Hoàn toàn không thực dụng', 'Chi phí bảo dưỡng khổng lồ'],
  },
  // ===== MG =====
  'mg-zs': {
    pros: ['Giá rẻ, nhiều trang bị', 'Gầm cao, rộng rãi', 'Bảo hành dài'],
    cons: ['Cách âm và vật liệu cơ bản', 'Máy 1.5 yếu', 'Giữ giá thấp'],
  },
  'mg-mg5': {
    pros: ['Sedan cỡ C giá rất rẻ', 'Cabin rộng', 'Trang bị khá so với giá'],
    cons: ['Máy yếu, hộp số CVT ồn', 'An toàn cơ bản', 'Giữ giá thấp'],
  },
  'mg-mg4': {
    pros: ['Hatchback điện lái vui, dẫn động cầu sau', 'Giá hợp lý cho EV', 'Phân bổ trọng lượng tốt'],
    cons: ['Cách âm cơ bản', 'Hạ tầng sạc và hậu mãi còn mới', 'Vật liệu nội thất bình thường'],
  },
  // ===== Geely =====
  'geely-coolray': {
    pros: ['Máy 1.5 turbo mạnh, bốc', 'Trang bị nhiều so với giá', 'Thiết kế trẻ trung'],
    cons: ['Thương hiệu mới, giữ giá chưa rõ', 'Hộp số đôi lúc hơi giật', 'Cách âm trung bình'],
  },
  'geely-monjaro': {
    pros: ['SUV hạng D trang bị rất hậu hĩnh', 'Nội thất sang, công nghệ cao', 'Vận hành êm, mạnh'],
    cons: ['Thương hiệu mới tại VN', 'Giữ giá chưa rõ', 'Hao xăng hơn đối thủ hybrid'],
  },
  // ===== Zeekr =====
  'zeekr-001': {
    pros: ['Shooting brake điện đẹp, hiệu năng cao', 'Nội thất cao cấp, công nghệ tốt', 'Tăng tốc mạnh, sạc nhanh'],
    cons: ['Thương hiệu mới tại VN', 'Hạ tầng sạc phù hợp còn ít', 'Giữ giá chưa rõ'],
  },
  'zeekr-x': {
    pros: ['SUV điện nhỏ thiết kế cá tính', 'Tăng tốc nhanh', 'Nội thất hiện đại'],
    cons: ['Cốp và khoang sau nhỏ', 'Hậu mãi và sạc còn mới', 'Quãng đường vừa phải'],
  },
  // ===== Chery =====
  'chery-omoda-5': {
    pros: ['Thiết kế trẻ, nhiều trang bị', 'Giá hợp lý', 'Bảo hành dài'],
    cons: ['Thương hiệu mới, giữ giá chưa rõ', 'Cách âm trung bình', 'Hộp số CVT hơi ồn'],
  },
  'chery-tiggo-8': {
    pros: ['SUV 7 chỗ máy turbo mạnh', 'Trang bị phong phú, giá tốt', 'Nội thất rộng, nhiều màn hình'],
    cons: ['Thương hiệu mới tại VN', 'Giữ giá là dấu hỏi', 'Hàng ghế 3 vừa phải'],
  },
  // ===== Haval =====
  'haval-h6': {
    pros: ['Trang bị an toàn và tiện nghi cực nhiều', 'Bản hybrid mạnh, tiết kiệm', 'Nội thất rộng, hiện đại'],
    cons: ['Thương hiệu mới, giữ giá kém', 'Tiêu hao xăng bản thường khá cao', 'Hậu mãi còn mỏng'],
  },
  'haval-jolion': {
    pros: ['Hybrid tiết kiệm, giá hợp lý', 'Trang bị nhiều so với giá', 'Thiết kế trẻ trung'],
    cons: ['Thương hiệu mới tại VN', 'Cách âm trung bình', 'Giữ giá chưa rõ'],
  },
  // ===== Tank =====
  'tank-300': {
    pros: ['Off-road thực thụ kèm hybrid hiện đại', 'Thiết kế hầm hố cá tính', 'Nội thất trang bị nhiều'],
    cons: ['Thương hiệu mới tại VN', 'Hao xăng, thân xe nặng', 'Giữ giá chưa rõ'],
  },
  'tank-500': {
    pros: ['SUV off-road cỡ lớn 7 chỗ sang trọng', 'Hybrid mạnh mẽ', 'Trang bị cao cấp, bệ vệ'],
    cons: ['Thân xe rất lớn, khó đỗ', 'Hao nhiên liệu', 'Hậu mãi và giữ giá còn là ẩn số'],
  },
  // ===== Ora =====
  'ora-good-cat': {
    pros: ['Thiết kế retro dễ thương', 'Nội thất hiện đại, trang bị nhiều', 'Vận hành êm'],
    cons: ['Quãng đường thực tế vừa phải', 'Hạ tầng sạc và hậu mãi còn mới', 'Cốp nhỏ'],
  },
  'ora-07': {
    pros: ['Sedan điện thiết kế đẹp, thể thao', 'Tăng tốc mạnh', 'Trang bị phong phú'],
    cons: ['Thương hiệu mới tại VN', 'Hạ tầng sạc hạn chế', 'Giữ giá chưa rõ'],
  },
  // ===== NIO =====
  'nio-et5': {
    pros: ['Sedan điện cao cấp, hiệu năng mạnh', 'Công nghệ và nội thất ấn tượng', 'Hỗ trợ đổi pin độc đáo'],
    cons: ['Hệ thống đổi pin chưa có tại VN', 'Hậu mãi còn mới', 'Giá cao'],
  },
  'nio-es6': {
    pros: ['SUV điện sang, mạnh mẽ', 'Nội thất cao cấp, công nghệ nhiều', 'Vận hành êm ái'],
    cons: ['Hạ tầng sạc/đổi pin tại VN hạn chế', 'Giá cao', 'Thanh khoản chưa rõ'],
  },
  // ===== XPeng =====
  'xpeng-g6': {
    pros: ['SUV điện công nghệ cao, sạc 800V nhanh', 'Hệ thống hỗ trợ lái tiên tiến', 'Tăng tốc mạnh'],
    cons: ['Thương hiệu mới tại VN', 'Hạ tầng sạc nhanh còn ít', 'Hậu mãi chưa rõ'],
  },
  'xpeng-p7': {
    pros: ['Sedan điện thể thao, thiết kế đẹp', 'Tăng tốc nhanh, lái cân bằng', 'Công nghệ phong phú'],
    cons: ['Thương hiệu mới tại VN', 'Hạ tầng sạc hạn chế', 'Giữ giá chưa rõ'],
  },
  // ===== Li Auto =====
  'li-auto-l9': {
    pros: ['SUV cỡ lớn 6 chỗ rất sang, có động cơ tăng phạm vi nên không lo trạm sạc', 'Cabin xa hoa, nhiều màn hình', 'Vận hành êm, mạnh'],
    cons: ['Thân xe rất lớn', 'Thương hiệu mới tại VN', 'Vẫn cần đổ xăng cho bộ tăng phạm vi'],
  },
  'li-auto-l7': {
    pros: ['SUV gia đình sang, không lo quãng đường nhờ tăng phạm vi', 'Nội thất rộng, tiện nghi cao', 'Vận hành êm ái'],
    cons: ['Thương hiệu mới tại VN', 'Hậu mãi chưa rõ', 'Thân xe lớn'],
  },
  // ===== Hongqi =====
  'hongqi-hs5': {
    pros: ['Thiết kế bệ vệ, sang trọng', 'Trang bị phong phú', 'Giá cạnh tranh trong nhóm SUV C'],
    cons: ['Thương hiệu xa lạ tại VN', 'Giữ giá thấp', 'Hậu mãi hạn chế'],
  },
  'hongqi-h9': {
    pros: ['Sedan sang trọng bề thế, nội thất xa hoa', 'Trang bị cực kỳ phong phú', 'Êm ái, cách âm tốt'],
    cons: ['Thương hiệu kén khách', 'Giữ giá thấp', 'Hậu mãi và phụ tùng hạn chế'],
  },
  // ===== Skoda =====
  'skoda-kodiaq': {
    pros: ['SUV 7 chỗ rộng và thực dụng kiểu Đức', 'Nhiều tiện ích thông minh', 'Vận hành chắc chắn'],
    cons: ['Thương hiệu mới tại VN', 'Giữ giá chưa rõ', 'Mạng lưới dịch vụ đang xây dựng'],
  },
  'skoda-karoq': {
    pros: ['SUV cỡ C chắc chắn, thực dụng', 'Cabin rộng, nhiều tiện ích', 'Lái đầm kiểu Đức'],
    cons: ['Thương hiệu mới, kén khách', 'Trang bị bản tiêu chuẩn vừa phải', 'Giữ giá chưa rõ'],
  },
  'skoda-superb': {
    pros: ['Khoang cabin và cốp cực rộng', 'Trang bị tiện nghi cao cấp', 'Vận hành êm, chắc chắn'],
    cons: ['Thương hiệu mới tại VN', 'Giữ giá là ẩn số', 'Mạng lưới dịch vụ còn ít'],
  },
  'skoda-slavia': {
    pros: ['Sedan hạng B khung gầm Đức chắc chắn', 'Cabin và cốp rộng', 'Máy turbo tiết kiệm'],
    cons: ['Thương hiệu mới, kén khách', 'Trang bị giải trí đơn giản', 'Giữ giá chưa rõ'],
  },
  // ===== Wuling =====
  'wuling-mini-ev': {
    pros: ['Giá rẻ nhất thị trường', 'Cực kỳ nhỏ gọn cho phố đông', 'Chi phí sạc gần như không đáng kể'],
    cons: ['Quãng đường rất ngắn', 'Trang bị an toàn tối thiểu', 'Chỉ hợp di chuyển nội đô'],
  },
  'wuling-bingo': {
    pros: ['Xe điện đô thị giá mềm', 'Cabin rộng so với cỡ xe', 'Dễ lái, tiết kiệm'],
    cons: ['Quãng đường vừa phải', 'Trang bị an toàn cơ bản', 'Hậu mãi còn mới'],
  },
  // ===== Lynk & Co =====
  'lynk-co-01': {
    pros: ['Nền tảng Volvo, an toàn và chắc chắn', 'Hybrid mạnh, trang bị nhiều', 'Thiết kế cá tính'],
    cons: ['Thương hiệu mới tại VN', 'Giữ giá chưa rõ', 'Chi phí phụ tùng có thể cao'],
  },
  'lynk-co-05': {
    pros: ['Coupe SUV thiết kế thể thao, độc đáo', 'Máy turbo mạnh', 'Nội thất cao cấp'],
    cons: ['Khoang sau dốc, hơi chật', 'Thương hiệu mới', 'Giữ giá chưa rõ'],
  },
  'lynk-co-06': {
    pros: ['SUV cỡ B trang bị nhiều', 'Thiết kế trẻ trung', 'Giá hợp lý'],
    cons: ['Thương hiệu mới tại VN', 'Cách âm trung bình', 'Giữ giá chưa rõ'],
  },
  'lynk-co-09': {
    pros: ['SUV 7 chỗ nền tảng Volvo cao cấp', 'Hybrid mạnh mẽ, êm ái', 'Nội thất sang, an toàn cao'],
    cons: ['Giá cao', 'Thương hiệu mới, giữ giá ẩn số', 'Thân xe lớn'],
  },
  // ===== Aion =====
  'aion-y-plus': {
    pros: ['SUV điện cabin rộng, sàn phẳng', 'Giá hợp lý, trang bị khá', 'Vận hành êm'],
    cons: ['Thiết kế kén người', 'Hạ tầng sạc và hậu mãi còn mới', 'Quãng đường thực tế vừa phải'],
  },
  'aion-es': {
    pros: ['Sedan điện giá tốt, hợp chạy dịch vụ', 'Chi phí vận hành thấp', 'Cabin rộng'],
    cons: ['Trang bị hướng dịch vụ, đơn giản', 'Hậu mãi còn mới', 'Quãng đường vừa phải'],
  },
  // ===== Jaecoo =====
  'jaecoo-j7': {
    pros: ['Thiết kế vuông vức sang trọng', 'Trang bị phong phú, giá tốt', 'Nội thất rộng, nhiều màn hình'],
    cons: ['Thương hiệu mới tại VN', 'Giữ giá chưa rõ', 'Cách âm trung bình'],
  },
  'jaecoo-j7-phev': {
    pros: ['Hybrid sạc điện quãng đường dài, tiết kiệm', 'Trang bị nhiều, vận hành êm', 'Có thể chạy thuần điện trong phố'],
    cons: ['Thương hiệu mới, giữ giá ẩn số', 'Hệ thống phức tạp hơn xe xăng', 'Hậu mãi còn mỏng'],
  },
  // ===== BYD (nhóm 2) =====
  'byd-sealion-6': {
    pros: ['Hybrid DM-i cắm sạc rất tiết kiệm', 'Trang bị phong phú', 'Vận hành êm, mạnh'],
    cons: ['Thương hiệu còn mới tại VN', 'Giữ giá chưa rõ', 'Cách âm ở mức khá'],
  },
  'byd-m6': {
    pros: ['MPV điện 7 chỗ giá hợp lý', 'Cabin rộng, chi phí vận hành thấp', 'Vận hành êm ái'],
    cons: ['Công suất khiêm tốn khi đủ tải', 'Quãng đường vừa phải', 'Hạ tầng sạc còn hạn chế'],
  },
  'byd-han': {
    pros: ['Sedan điện sang, tăng tốc rất mạnh', 'Nội thất cao cấp, công nghệ nhiều', 'Pin Blade an toàn'],
    cons: ['Hậu mãi còn mới tại VN', 'Tiêu hao điện cao khi chạy nhanh', 'Giữ giá chưa rõ'],
  },
  'byd-tang': {
    pros: ['SUV điện 7 chỗ mạnh mẽ, rộng rãi', 'Trang bị phong phú', 'Pin Blade bền, an toàn'],
    cons: ['Quãng đường giảm khi đủ tải', 'Thân xe lớn', 'Hạ tầng sạc và hậu mãi còn mới'],
  },
  // ===== MG (nhóm 2) =====
  'mg-hs': {
    pros: ['SUV cỡ C giá rẻ, rộng rãi', 'Trang bị an toàn khá, bảo hành dài', 'Thiết kế hiện đại'],
    cons: ['Máy turbo hao xăng', 'Cách âm trung bình', 'Giữ giá thấp'],
  },
  'mg-mg7': {
    pros: ['Sedan hạng D thiết kế thể thao, giá rẻ', 'Máy turbo mạnh', 'Trang bị nhiều'],
    cons: ['Thương hiệu giữ giá kém', 'Cách âm trung bình', 'Hậu mãi còn mỏng'],
  },
  // ===== Geely ex5 =====
  'geely-ex5': {
    pros: ['SUV điện cỡ C giá cạnh tranh', 'Trang bị phong phú', 'Cabin rộng, vận hành êm'],
    cons: ['Thương hiệu EV mới tại VN', 'Hạ tầng sạc còn hạn chế', 'Giữ giá chưa rõ'],
  },
  // ===== Zeekr 009 =====
  'zeekr-009': {
    pros: ['MPV điện hạng sang khoang VIP xa hoa', 'Cực êm và yên tĩnh', 'Trang bị thượng hạng, sạc nhanh'],
    cons: ['Giá cao', 'Thân xe rất lớn', 'Hạ tầng sạc và hậu mãi còn mới'],
  },
  // ===== Mercedes (nhóm 2) =====
  'mercedes-sclass': {
    pros: ['Chuẩn mực sedan siêu sang, êm và yên tĩnh tuyệt đối', 'Công nghệ tiên phong, nội thất xa hoa', 'Cabin sau như khoang thương gia'],
    cons: ['Giá và chi phí nuôi rất cao', 'Công nghệ phức tạp dễ lỗi', 'Khấu hao nhanh'],
  },
  'mercedes-glb': {
    pros: ['SUV vuông vức 7 chỗ hiếm hoi trong tầm giá', 'Nội thất Mercedes sang trọng', 'Thực dụng cho gia đình'],
    cons: ['Hàng ghế 3 rất chật', 'Máy 1.3 turbo vừa đủ', 'Chi phí bảo dưỡng cao'],
  },
  'mercedes-gle': {
    pros: ['SUV hạng sang bề thế, êm ái', 'Nội thất rộng, công nghệ cao', 'Động cơ mạnh mẽ'],
    cons: ['Giá và phí dịch vụ cao', 'Hao xăng', 'Tùy chọn nâng cấp đắt'],
  },
  'mercedes-gls': {
    pros: ['SUV 7 chỗ cỡ lớn xa hoa như S-Class', 'Cabin cực rộng và sang', 'Vận hành êm, mạnh'],
    cons: ['Thân xe rất lớn, khó đỗ', 'Rất hao xăng', 'Chi phí nuôi cao'],
  },
  'mercedes-gclass': {
    pros: ['Biểu tượng off-road kèm sang trọng', 'Thiết kế hộp vuông cá tính bất hủ', 'Giữ giá cực tốt, ba khóa vi sai'],
    cons: ['Giá rất cao, thường bán chênh', 'Lái trên phố cồng kềnh, hao xăng', 'Cách âm gió do dáng vuông'],
  },
  'mercedes-vclass': {
    pros: ['MPV hạng sang khoang rộng, linh hoạt', 'Máy dầu êm và tiết kiệm', 'Đưa đón thương gia lý tưởng'],
    cons: ['Giá cao', 'Lái như xe to', 'Chi phí bảo dưỡng cao'],
  },
  'mercedes-maybach-s': {
    pros: ['Đỉnh cao xa hoa của Mercedes', 'Ghế sau ngả thư giãn như khoang hạng nhất', 'Cách âm và êm ái tuyệt hảo'],
    cons: ['Giá cực cao', 'Chi phí nuôi lớn', 'Thân xe dài khó xoay trở'],
  },
  // ===== BMW (nhóm 2) =====
  'bmw-x5': {
    pros: ['Cân bằng giữa lái thể thao và tiện nghi', 'Nội thất sang, công nghệ cao', 'Động cơ mạnh mẽ'],
    cons: ['Giá và phí dịch vụ cao', 'Tùy chọn đắt', 'Hàng ghế 3 tùy chọn khá chật'],
  },
  'bmw-x7': {
    pros: ['SUV 7 chỗ cỡ lớn bệ vệ, sang trọng', 'Cabin rộng, vận hành êm và mạnh', 'Công nghệ đầy đủ'],
    cons: ['Thiết kế lưới tản nhiệt kén mắt', 'Hao xăng, thân xe lớn', 'Chi phí nuôi cao'],
  },
  'bmw-7series': {
    pros: ['Sedan đầu bảng nhiều công nghệ tiên phong', 'Cabin sau xa hoa, màn hình giải trí lớn', 'Vận hành êm và mạnh'],
    cons: ['Thiết kế gây tranh cãi', 'Giá và chi phí nuôi cao', 'Công nghệ phức tạp'],
  },
  'bmw-x1': {
    pros: ['SUV sang cỡ nhỏ thực dụng', 'Cabin rộng so với kích thước', 'Lái chắc chắn, trang bị tốt'],
    cons: ['Dẫn động cầu trước, ít chất BMW', 'Chi phí bảo dưỡng cao', 'Tùy chọn đắt'],
  },
  'bmw-ix': {
    pros: ['SUV điện công nghệ cao, nội thất sang', 'Vận hành êm, tăng tốc mạnh', 'Cabin rộng, yên tĩnh'],
    cons: ['Thiết kế ngoại thất kén mắt', 'Giá cao', 'Hạ tầng sạc nhanh tại VN còn ít'],
  },
  // ===== Audi (nhóm 2) =====
  'audi-a6': {
    pros: ['Nội thất công nghệ đẹp, tinh tế', 'Vận hành êm ái, cách âm tốt', 'Quattro chắc chắn'],
    cons: ['Mẫu tại VN đã khá lâu', 'Chi phí dịch vụ cao', 'Cảm giác lái ít phấn khích'],
  },
  'audi-q7': {
    pros: ['SUV 7 chỗ sang, vận hành êm', 'Quattro mạnh mẽ, ổn định', 'Nội thất công nghệ cao'],
    cons: ['Giá và chi phí nuôi cao', 'Hao xăng', 'Hàng ghế 3 vừa phải'],
  },
  'audi-q8': {
    pros: ['SUV coupe sang trọng, thể thao', 'Thiết kế đẹp, nội thất cao cấp', 'Vận hành mạnh mẽ, êm'],
    cons: ['Khoang sau dốc, cốp giảm', 'Giá cao', 'Chi phí bảo dưỡng lớn'],
  },
  'audi-q3': {
    pros: ['SUV sang cỡ nhỏ, nội thất đẹp', 'Lái chắc chắn', 'Trang bị công nghệ tốt'],
    cons: ['Máy 1.4 turbo vừa đủ', 'Khoang sau vừa phải', 'Chi phí dịch vụ cao'],
  },
  // ===== Lexus (nhóm 2) =====
  'lexus-lx': {
    pros: ['SUV off-road siêu sang, bền bỉ', 'Cabin xa hoa, cách âm tuyệt vời', 'Giữ giá cực tốt'],
    cons: ['Giá rất cao, thường bán chênh', 'Rất hao xăng', 'Thân xe khổng lồ'],
  },
  'lexus-gx': {
    pros: ['SUV khung gầm rời bền, off-road tốt', 'Nội thất sang, bệ vệ', 'Giữ giá tốt'],
    cons: ['Hao xăng', 'Thân xe vuông cồng kềnh', 'Giá cao'],
  },
  'lexus-lm': {
    pros: ['MPV siêu sang khoang VIP đỉnh cao', 'Cực êm và yên tĩnh', 'Ghế thương gia thư giãn tuyệt vời'],
    cons: ['Giá rất cao', 'Thân xe lớn', 'Chỉ tối ưu cho người ngồi sau'],
  },
  'lexus-is': {
    pros: ['Sedan thể thao lái cân bằng, bền bỉ', 'Hoàn thiện kỹ, độ tin cậy cao', 'Cảm giác lái thú vị hơn các Lexus khác'],
    cons: ['Khoang sau và cốp hẹp', 'Công nghệ giải trí lỗi thời', 'Cách âm chưa bằng đàn anh'],
  },
  // ===== Volvo (nhóm 2) =====
  'volvo-xc90': {
    pros: ['SUV 7 chỗ an toàn hàng đầu', 'Nội thất Bắc Âu sang trọng, tối giản', 'Hybrid êm và mạnh'],
    cons: ['Giá cao', 'Hàng ghế 3 hợp người nhỏ', 'Ít đại lý so với Đức'],
  },
  'volvo-s90': {
    pros: ['Sedan sang êm ái, an toàn cao', 'Nội thất tinh tế, thoải mái', 'Cabin sau rộng'],
    cons: ['Cảm giác lái thiên êm, ít thể thao', 'Giữ giá kém xe Đức', 'Mạng lưới dịch vụ ít'],
  },
  'volvo-c40': {
    pros: ['SUV coupe điện thiết kế đẹp, an toàn', 'Tăng tốc mạnh', 'Nội thất thân thiện môi trường'],
    cons: ['Khoang sau dốc, tầm nhìn sau hạn chế', 'Quãng đường vừa phải', 'Hạ tầng sạc tại VN còn ít'],
  },
  // ===== Porsche panamera =====
  'porsche-panamera': {
    pros: ['Sedan thể thao lái xuất sắc', 'Nội thất sang, công nghệ cao', 'Vừa nhanh vừa tiện nghi'],
    cons: ['Giá và tùy chọn rất đắt', 'Chi phí bảo dưỡng cao', 'Thiết kế kén người'],
  },
  // ===== Range Rover velar =====
  'range-rover-velar': {
    pros: ['Thiết kế tối giản đẹp bậc nhất', 'Nội thất sang, màn hình ẩn tinh tế', 'Vận hành êm ái'],
    cons: ['Độ tin cậy chưa cao', 'Chi phí bảo dưỡng đắt', 'Giữ giá thấp'],
  },
  // ===== Genesis (nhóm 2) =====
  'genesis-g70': {
    pros: ['Sedan thể thao lái tốt, trang bị nhiều', 'Nội thất cao cấp', 'Giá hời so với xe Đức'],
    cons: ['Thương hiệu chưa phổ biến tại VN', 'Khoang sau hẹp', 'Giữ giá khó đoán'],
  },
  'genesis-gv70': {
    pros: ['SUV sang lái thể thao, nội thất đẹp', 'Trang bị rất phong phú', 'Vận hành mạnh mẽ'],
    cons: ['Thương hiệu mới, thanh khoản thấp', 'Hao xăng', 'Ít đại lý hỗ trợ'],
  },
  // ===== Maserati levante =====
  'maserati-levante': {
    pros: ['SUV Ý cá tính, âm thanh động cơ hay', 'Thiết kế quyến rũ', 'Vận hành thể thao'],
    cons: ['Độ tin cậy là dấu hỏi', 'Hao xăng', 'Giữ giá thấp, hậu mãi hạn chế'],
  },
  // ===== Bentley flying spur =====
  'bentley-flying-spur': {
    pros: ['Sedan siêu sang vừa êm vừa nhanh', 'Thủ công tinh xảo, nội thất xa hoa', 'Động cơ W12/V8 mạnh mẽ'],
    cons: ['Giá và chi phí nuôi rất cao', 'Khấu hao nhanh', 'Thân xe lớn, hao xăng'],
  },
};
