import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// HỆ THỐNG SVG ICONS TINH TẾ, TỐI GIẢN
// ============================================================================
const IconBook = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const IconList = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const IconPlay = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);

const IconPause = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0v-12a.75.75 0 01.75-.75zm10.5 0a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0v-12a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

const IconCalendar = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconMapPin = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconQuote = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
  </svg>
);

const IconChevronLeft = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
  </svg>
);

const IconChevronRight = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
  </svg>
);

// ============================================================================
// DỮ LIỆU 13 MỐC SON LỊCH SỬ CHUẨN XÁC (1911 - 1941)
// ============================================================================
const journeyData = [
  {
    id: 1,
    year: "1911",
    date: "05/06/1911",
    location: "Bến Nhà Rồng, Sài Gòn",
    shortCity: "Sài Gòn",
    country: "Việt Nam",
    alias: "Văn Ba",
    vehicle: "Tàu Amiral Latouche-Tréville",
    title: "Khởi đầu vĩ đại - Rời Tổ quốc ra đi tìm đường cứu nước",
    image: "https://data.ihoc.vn/ihoc-bucket/2023/07/cang-nha-rong.jpg",
    desc: "Tại cảng Sài Gòn, người thanh niên yêu nước 21 tuổi Nguyễn Tất Thành với tên gọi Văn Ba nhận làm phụ bếp trên tàu buôn Amiral Latouche-Tréville của hãng Năm Sao, bắt đầu cuộc hành trình vĩ đại tìm con đường giải phóng dân tộc.",
    significance: "Bước ngoặt lịch sử mở đầu tư duy mới: Không đi theo con đường phong kiến hay cầu viện Nhật Bản như các bậc tiền bối, mà trực tiếp sang phương Tây để tìm hiểu bản chất của chủ nghĩa đế quốc.",
    quote: "Tôi muốn đi ra nước ngoài, xem nước Pháp và các nước khác. Sau khi xem xét họ làm như thế nào, tôi sẽ trở về giúp đồng bào chúng ta."
  },
  {
    id: 2,
    year: "1911",
    date: "Tháng 07/1911",
    location: "Marseille & Le Havre",
    shortCity: "Marseille",
    country: "Pháp",
    alias: "Văn Ba",
    vehicle: "Đường biển",
    title: "Bước chân đầu tiên đến phương Tây - Nhận thức về 'Mẫu quốc'",
    image: "https://truyenhinhnghean.vn/file/4028eaa46735a26101673a4df345003c/4028eaa467f477c80167f48e23810ac6/112019/macxay2_201911111721.jpg",
    desc: "Cập bến Marseille rồi Le Havre, Người tận mắt chứng kiến đời sống cơ cực của những người lao động Pháp. Người thấy người Pháp nghèo cũng phải làm thuê, bốc vác vất vả, trái ngược hoàn toàn với khẩu hiệu 'Tự do - Bình đẳng - Bác ái'.",
    significance: "Người sớm nhận thức chân lý: Ngay tại chính quốc, nhân dân lao động cũng bị bóc lột, áp bức. Đây là cơ sở hình thành nhận thức về sự liên minh giai cấp lao động toàn cầu.",
    quote: "Tại sao người Pháp không khai hóa đồng bào của họ trước khi đi khai hóa người khác?"
  },
  {
    id: 3,
    year: "1912 - 1913",
    date: "1912 - 1913",
    location: "New York & Boston",
    shortCity: "Hoa Kỳ",
    country: "Hoa Kỳ",
    alias: "Nguyễn Tất Thành",
    vehicle: "Tàu viễn dương",
    title: "Khảo sát nền dân chủ tư sản tại Tân thế giới",
    image: "https://image.vietmy.net.vn/public/data/images/0/2025/08/18/upload_2144/image-20240605071802-2.jpeg",
    desc: "Người đến Mỹ, làm thuê tại khu Brooklyn (New York) và phụ bếp tại khách sạn Omni Parker House (Boston). Người dành thời gian đọc Bản Tuyên ngôn Độc lập năm 1776 của Mỹ và tìm hiểu cuộc đấu tranh giải phóng người da màu.",
    significance: "Người nhận định: Tuyên ngôn Độc lập Mỹ tuy nêu cao quyền con người, nhưng thực chất vẫn là nền dân chủ tư sản, giai cấp tư bản vẫn bóc lột người lao động.",
    quote: "Mỹ đã nêu tấm gương sáng về độc lập, nhưng độc lập ấy vẫn chưa đem lại hạnh phúc thật sự cho đại đa số nhân dân lao động."
  },
  {
    id: 4,
    year: "1913 - 1917",
    date: "1913 - 1917",
    location: "London, Vương quốc Anh",
    shortCity: "London",
    country: "Nước Anh",
    alias: "Nguyễn Tất Thành",
    vehicle: "Tàu biển / Tàu hỏa",
    title: "Hòa mình vào phong trào công nhân quốc tế tại London",
    image: "https://bna.1cdn.vn/2025/05/14/khach-san-carlton-o-london-anh-noi-nguoi-thanh-nien-yeu-nuoc-nguyen-tat-thanh-lam-viec-trong-thoi-gian-song-o-nuoc-anh-nam-1914..jpg",
    desc: "Người sinh sống tại London, làm đủ nghề cực nhọc: quét tuyết, đốt lò, phụ bếp khách sạn Carlton dưới sự hướng dẫn của bếp trưởng Escoffier. Người tham gia 'Hội những người lao động hải ngoại' và nghiên cứu phong trào nghiệp đoàn Anh.",
    significance: "Trực tiếp trui rèn bản lĩnh trong giai cấp công nhân công nghiệp hiện đại bậc nhất thế giới, làm giàu thêm vốn văn hóa và ngôn ngữ.",
    quote: "Dù làm việc quần quật suốt ngày, Người vẫn tranh thủ từng giờ đêm khuya để tự học và đọc sách báo tiến bộ."
  },
  {
    id: 5,
    year: "1919",
    date: "18/06/1919",
    location: "Hội nghị Versailles, Paris",
    shortCity: "Paris",
    country: "Pháp",
    alias: "Nguyễn Ái Quốc",
    vehicle: "Đường sắt Pháp",
    title: "Tiếng sấm tại Versailles - Bản Yêu sách của nhân dân An Nam",
    image: "https://media.vov.vn/sites/default/files/styles/large/public/2021-06/nguyen_ai_quoc_tai_dai_hoi_dcs_phap_o_tours_2.jpg",
    desc: "Thay mặt 'Nhóm những người An Nam yêu nước', Người ký tên Nguyễn Ái Quốc gửi tới Hội nghị Versailles bản 'Yêu sách của nhân dân An Nam' gồm 8 điểm, đòi quyền tự do, bình đẳng và quyền tự quyết cho dân tộc Việt Nam.",
    significance: "Cú đòn chính trị trực diện đầu tiên giáng vào chủ nghĩa đế quốc trên trường quốc tế. Tên tuổi Nguyễn Ái Quốc làm chấn động dư luận Pháp.",
    quote: "Muốn được giải phóng, các dân tộc chỉ có thể trông cậy vào lực lượng của bản thân mình."
  },
  {
    id: 6,
    year: "1920",
    date: "Tháng 12/1920",
    location: "Đại hội Tours, Pháp",
    shortCity: "Tours",
    country: "Pháp",
    alias: "Nguyễn Ái Quốc",
    vehicle: "Tàu hỏa Tours",
    title: "Bước ngoặt lịch sử: Bỏ phiếu gia nhập Quốc tế III & Sáng lập Đảng CS Pháp",
    image: "https://images.spiderum.com/sp-images/55d8f4504a9c11ef8293019fc975e0f6.png",
    desc: "Tháng 7/1920, Người đọc Luận cương của V.I. Lênin về vấn đề dân tộc và thuộc địa. Tháng 12/1920 tại Đại hội Tours, Người bỏ phiếu tán thành gia nhập Quốc tế III và trở thành một trong những người sáng lập Đảng Cộng sản Pháp.",
    significance: "Bước ngoặt quyết định từ người yêu nước trở thành chiến sĩ cộng sản. Người tìm thấy con đường cứu nước duy nhất đúng đắn: Cách mạng vô sản gắn liền giải phóng dân tộc.",
    quote: "Hỡi đồng bào bị đày đọa đau khổ! Đây là cái cần thiết cho chúng ta, đây là con đường giải phóng chúng ta!"
  },
  {
    id: 7,
    year: "1921 - 1923",
    date: "1921 - 1923",
    location: "Paris, Pháp",
    shortCity: "Paris",
    country: "Pháp",
    alias: "Nguyễn Ái Quốc",
    vehicle: "Hoạt động bí mật",
    title: "Sáng lập Hội Liên hiệp Thuộc địa & Báo 'Le Paria' (Người cùng khổ)",
    image: "https://imgnvsk.vnanet.vn/MediaUpload/Org/2023/09/14/vn75-0116214-10-16-36.jpg",
    desc: "Người cùng các chiến sĩ cách mạng các nước thuộc địa thành lập Hội Liên hiệp Thuộc địa và sáng lập báo Le Paria. Người trực tiếp làm chủ nhiệm kiêm chủ bút, viết bài tố cáo tội ác của thực dân Pháp.",
    significance: "Bắt đầu sử dụng báo chí sắc bén làm vũ khí cách mạng. Đặt nền móng cho mặt trận đoàn kết nhân dân các dân tộc thuộc địa.",
    quote: "Tờ báo Le Paria là ngọn cờ kêu gọi nhân dân thuộc địa bị áp bức đứng lên tự giải phóng xiềng xích."
  },
  {
    id: 8,
    year: "1923 - 1924",
    date: "Tháng 06/1923",
    location: "Moscow, Liên Xô",
    shortCity: "Moscow",
    country: "Liên Xô",
    alias: "Nguyễn Ái Quốc",
    vehicle: "Bí mật qua Đức - Nga",
    title: "Đến quê hương Cách mạng Tháng Mười - Học tập tại Đại học Phương Đông",
    image: "https://scontent.fdad3-1.fna.fbcdn.net/v/t1.6435-9/101674977_590115574954105_1072893663038601311_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeHE1JkooUXIonkyOvtqlMU58IgidPbyjHLwiCJ09vKMck-vmSrhWCUk8iQGlbeJTtCNSs4SVvegWH0qOGAmB8kJ&_nc_ohc=_FpMqGxfMAQQ7kNvwEM_WV0&_nc_oc=Ado2TTCHWxvTQlQUKJZY2r52ngzlJYxIcAeCOT5MCJ7SltaqTnSzdCjQLKuMdrlHeGWoxS_LRXz8Z9aO85Lb6w1P&_nc_zt=23&_nc_ht=scontent.fdad3-1.fna&_nc_gid=NVDv-vDqEyizgQsxefjBuw&_nc_ss=7a3a8&oh=00_Af2n19m2zc0SuCPoYQV5wTLij8s_tzJn4IFkccy0aCcZeQ&oe=6A09445E",
    desc: "Người bí mật rời Paris sang Moscow dự Hội nghị Quốc tế Nông dân và học tập tại Trường Đại học Phương Đông. Người khẳng định cách mạng thuộc địa có thể chủ động thắng lợi trước cách mạng chính quốc.",
    significance: "Hoàn thiện hệ thống lý luận cách mạng giải phóng dân tộc và đóng góp to lớn vào kho tàng lý luận Mác - Lênin.",
    quote: "Chủ nghĩa Lênin đối với chúng ta là ánh mặt trời rực rỡ soi sáng con đường đi tới thắng lợi cuối cùng."
  },
  {
    id: 9,
    year: "1924 - 1927",
    date: "11/11/1924",
    location: "Quảng Châu, Trung Quốc",
    shortCity: "Quảng Châu",
    country: "Trung Quốc",
    alias: "Lý Thụy",
    vehicle: "Tàu hỏa / Tàu biển",
    title: "Sáng lập Hội Việt Nam Cách mạng Thanh niên & Xuất bản 'Đường Kách mệnh'",
    image: "https://hochiminh.vn/publish/thumbnail/3000001/480x720xfull/upload/3000001/20251024/8952355cfd4f9213404028053b86c9c4duong-cach-menh-400x610.jpg",
    desc: "Người về Quảng Châu thành lập Hội Việt Nam Cách mạng Thanh niên, trực tiếp mở các lớp đào tạo chính trị cho cán bộ ưu tú, xuất bản báo Thanh Niên và cuốn sách kinh điển 'Đường Kách mệnh' (1927).",
    significance: "Chuẩn bị trực tiếp và toàn diện về chính trị, tư tưởng và tổ chức cho sự ra đời của Đảng Cộng sản Việt Nam.",
    quote: "Cách mệnh trước hết phải có Đảng cách mệnh, để trong thì vận động và tổ chức dân chúng, ngoài thì liên lạc với dân tộc bị áp bức."
  },
  {
    id: 10,
    year: "1928 - 1929",
    date: "Mùa thu 1928",
    location: "Udon Thani, Phichit",
    shortCity: "Thái Lan",
    country: "Thái Lan",
    alias: "Thầu Chín",
    vehicle: "Đường bộ / Biển",
    title: "Phong cách 'Quần chúng hóa' - Xây dựng cơ sở trong kiều bào",
    image: "https://bidv.com.vn/wps/wcm/connect/17bcc7b5-4932-4023-a73d-ca247aaacd41/3/Nh%C3%A0+l%E1%BB%A3p+m%C3%A1i+l%C3%A1+t%C3%A1i+hi%E1%BB%87n+g%E1%BA%A7n+gi%E1%BB%91ng+n%C6%A1i+B%C3%A1c+H%E1%BB%93+sinh+s%E1%BB%91ng+%E1%BB%9F+t%E1%BB%89nh+Udon+Thani%2C+giai+%C4%91o%E1%BA%A1n+1928-1929..jpg?MOD=AJPERES&CVID=",
    desc: "Hoạt động bí mật tại Xiêm với bí danh Thầu Chín, Người cùng bà con mở đường xá, làm trường học, khai khẩn đất hoang và dạy chữ Quốc ngữ, giác ngộ đồng bào kiều bào hướng về Tổ quốc.",
    significance: "Biểu hiện mẫu mực của phương pháp cách mạng gần dân, học dân, làm cùng dân; tạo dựng bàn đạp hậu phương kiều bào vững chắc.",
    quote: "Muốn tuyên truyền cách mạng, phải nói bằng ngôn ngữ của nhân dân và làm những việc thiết thực có ích cho nhân dân."
  },
  {
    id: 11,
    year: "1930",
    date: "03/02/1930",
    location: "Cửu Long, Hương Cảng",
    shortCity: "Hồng Kông",
    country: "Hồng Kông",
    alias: "Tống Văn Sơ",
    vehicle: "Tàu biển",
    title: "Mùa xuân lịch sử - Hợp nhất và thành lập Đảng Cộng sản Việt Nam",
    image: "https://bqn.1cdn.vn/2020/08/26/baodanang.vn-dataimages-202008-original-_images1577633_11.jpg",
    desc: "Tại Cửu Long (Hồng Kông), Người chủ trì Hội nghị hợp nhất ba tổ chức cộng sản, chính thức thành lập Đảng Cộng sản Việt Nam, thông qua Chính cương vắn tắt và Sách lược vắn tắt do Người soạn thảo.",
    significance: "Chấm dứt cuộc khủng hoảng sâu sắc về đường lối cứu nước kéo dài gần một thế kỷ. Cách mạng Việt Nam có người cầm lái vĩ đại.",
    quote: "Đảng là đội tiên phong của vô sản giai cấp, phải thu phục cho được đại bộ phận giai cấp mình."
  },
  {
    id: 12,
    year: "1931 - 1938",
    date: "1931 - 1938",
    location: "Hồng Kông & Moscow",
    shortCity: "Moscow",
    country: "Liên Xô",
    alias: "Lin",
    vehicle: "Vượt ngục bí mật",
    title: "Vượt qua thử thách lao tù & Kiên định đường lối độc lập",
    image: "https://images2.thanhnien.vn/528068263637045248/2025/11/4/z718982078595315e032d55228d6e42e9648e8b2e5399b-1762275539365722570597.jpg",
    desc: "Tháng 6/1931, Người bị cảnh sát Anh bắt tại Hồng Kông (Vụ án Tống Văn Sơ). Nhờ sự giúp đỡ của luật sư Loseby, Người được trả tự do, bí mật sang Thượng Hải rồi về Moscow tiếp tục nghiên cứu.",
    significance: "Thể hiện ý chí gang thép, niềm tin tất thắng vào cách mạng, tôi luyện phẩm chất của một lãnh tụ vĩ đại trước mọi hiểm nguy.",
    quote: "Kiên trì và nhẫn nại / Không chịu lùi một phân / Vật chất tuy đau khổ / Không nao núng tinh thần."
  },
  {
    id: 13,
    year: "1941",
    date: "28/01/1941",
    location: "Cột mốc 108, Pác Bó, Cao Bằng",
    shortCity: "Pác Bó",
    country: "Việt Nam",
    alias: "Hồ Chí Minh (Già Thu)",
    vehicle: "Đi bộ đường rừng",
    title: "Mùa xuân Tổ quốc - Trở về đất mẹ sau 30 năm bôn ba",
    image: "https://media.baocaobang.vn/upload/image/202301/medium/100703_11.jpg",
    desc: "Sáng ngày 28/1/1941 (mùng 2 Tết Tân Tỵ), sau đúng 30 năm xa cách quê hương, Người cùng các đồng chí vượt qua cột mốc 108 biên giới trở về Pác Bó (Cao Bằng), trực tiếp lãnh đạo phong trào cách mạng cả nước.",
    significance: "Khép lại trọn vẹn 30 năm tìm đường cứu nước đầy gian nan, mở ra thời kỳ chuẩn bị khởi nghĩa vũ trang tiến tới Cách mạng Tháng Tám 1945.",
    quote: "Bác đã về đây, Tổ quốc ơi! / Nhớ thương hòn đất ấm hơi Người / Ba mươi năm ấy, chân không nghỉ / Mà đến bây giờ mới tới nơi!"
  }
];

function JourneyMapPage() {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState('story'); // 'story' hoặc 'timeline'
  const autoPlayRef = useRef(null);
  const timelineScrollRef = useRef(null);
  const currentItem = journeyData[activeIdx];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Tự động cuộn mốc đang chọn vào giữa
  useEffect(() => {
    if (timelineScrollRef.current) {
      const activeBtn = timelineScrollRef.current.querySelector(`[data-idx="${activeIdx}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeIdx]);

  // Phím mũi tên sang trái/phải
  const handlePrev = useCallback(() => {
    setIsPlaying(false);
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNext = useCallback(() => {
    setIsPlaying(false);
    setActiveIdx((prev) => (prev < journeyData.length - 1 ? prev + 1 : prev));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Tự động chuyển chặng
  useEffect(() => {
    if (isPlaying) {
      autoPlayRef.current = setInterval(() => {
        setActiveIdx((prev) => {
          if (prev < journeyData.length - 1) return prev + 1;
          setIsPlaying(false);
          clearInterval(autoPlayRef.current);
          return 0;
        });
      }, 5000);
    } else {
      clearInterval(autoPlayRef.current);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 py-6 sm:py-8 px-3 sm:px-6 font-['Lora',serif] selection:bg-red-200">
      <div className="max-w-5xl mx-auto">

        {/* 1. BREADCRUMB THANH THOÁT */}
        <div className="flex items-center justify-between text-xs font-sans text-stone-500 mb-6 pb-3 border-b border-stone-200/60">
          <div className="flex items-center gap-1.5">
            <Link to="/" className="hover:text-red-700 transition-colors">Trang chủ</Link>
            <span className="text-stone-300">/</span>
            <Link to="/bio" className="hover:text-red-700 transition-colors">Cuộc đời, sự nghiệp</Link>
            <span className="text-stone-300">/</span>
            <span className="text-red-800 font-bold">Hành trình cứu nước (1911 – 1941)</span>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-stone-600 hover:text-red-700 font-medium cursor-pointer transition-colors"
          >
            <IconChevronLeft className="w-3.5 h-3.5" />
            <span>Quay lại</span>
          </button>
        </div>

        {/* 2. TIÊU ĐỀ GỌN GÀNG, KHÔNG RỐI MẮT */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 tracking-tight mb-2">
            Hành Trình 30 Năm Cứu Nước
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 italic max-w-2xl mx-auto leading-relaxed">
            "Từ Bến Nhà Rồng năm 1911 đến cột mốc 108 Pác Bó mùa xuân 1941 — Ba mươi năm bôn ba tìm chân lý giải phóng cho toàn thể dân tộc Việt Nam."
          </p>
        </div>

        {/* 3. THANH ĐIỀU HƯỚNG CHẾ ĐỘ & TỰ ĐỘNG PHÁT (DUY NHẤT 1 HÀNG) */}
        <div className="flex items-center justify-between gap-3 mb-6 font-sans text-xs">
          {/* Nút chuyển đổi giao diện */}
          <div className="inline-flex items-center bg-stone-200/60 p-1 rounded-xl border border-stone-300/40">
            <button
              onClick={() => setViewMode('story')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'story'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <IconBook className="w-3.5 h-3.5" />
              <span>Từng chặng</span>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <IconList className="w-3.5 h-3.5" />
              <span>Xem tất cả (13 mốc)</span>
            </button>
          </div>

          {/* Nút tự động phát (chỉ hiện khi xem từng chặng) */}
          {viewMode === 'story' && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer border ${
                isPlaying
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm animate-pulse'
                  : 'bg-white text-stone-700 border-stone-300/70 hover:border-red-300 hover:text-red-700 shadow-2xs'
              }`}
            >
              {isPlaying ? (
                <>
                  <IconPause className="w-3.5 h-3.5" />
                  <span>Dừng</span>
                </>
              ) : (
                <>
                  <IconPlay className="w-3.5 h-3.5 text-red-600" />
                  <span>Tự động phát</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* ===================================================================== */}
        {/* CHẾ ĐỘ 1: TỪNG CHẶNG (THANH THOÁT, SẠCH SẼ, KHÔNG RỐI) */}
        {/* ===================================================================== */}
        {viewMode === 'story' && (
          <div className="space-y-5">

            {/* DẢI 13 MỐC NĂM DUY NHẤT (MINIMAL TIMELINE STRIP) */}
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs p-3 sm:p-4 font-sans">
              <div
                ref={timelineScrollRef}
                className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scroll-smooth"
              >
                {journeyData.map((item, idx) => {
                  const isSelected = activeIdx === idx;
                  const isPast = idx < activeIdx;

                  return (
                    <button
                      key={item.id}
                      data-idx={idx}
                      onClick={() => {
                        setActiveIdx(idx);
                        setIsPlaying(false);
                      }}
                      className={`flex flex-col items-center px-3 py-1.5 rounded-xl shrink-0 transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-red-700 text-white border-red-700 shadow-sm scale-105'
                          : isPast
                          ? 'bg-red-50/70 text-red-800 border-red-200/60 hover:bg-red-100/80'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <span className="text-[11px] font-bold font-mono">{item.year}</span>
                      <span className={`text-[10px] truncate max-w-[70px] ${isSelected ? 'text-red-100' : 'text-stone-400'}`}>
                        {item.shortCity}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* THẺ NỘI DUNG CHÍNH (TRANG TRỌNG, DỄ ĐỌC) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0">

                  {/* ẢNH TƯ LIỆU GỌN GÀNG */}
                  <div className="md:col-span-5 bg-stone-900 relative min-h-[240px] sm:min-h-[320px] flex flex-col justify-end p-4">
                    <img
                      src={currentItem.image}
                      alt={currentItem.title}
                      className="absolute inset-0 w-full h-full object-cover select-none"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/anh-bac-Ho.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>

                    {/* Chú thích ảnh tự nhiên, không che khuất */}
                    <div className="relative z-10 text-white font-sans text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-stone-300 text-[11px]">
                        <IconMapPin className="w-3 h-3 text-red-400" />
                        <span>{currentItem.location}</span>
                      </div>
                      <div className="text-amber-300 font-medium text-[11px]">
                        Bí danh thời kỳ này: <strong className="text-white text-xs">{currentItem.alias}</strong>
                      </div>
                    </div>
                  </div>

                  {/* NỘI DUNG LỊCH SỬ THOÁNG ĐÃNG */}
                  <div className="md:col-span-7 p-5 sm:p-7 flex flex-col justify-between">
                    <div>
                      {/* Tiêu đề chặng */}
                      <div className="flex items-center justify-between gap-2 text-xs font-sans text-stone-500 mb-2">
                        <span className="font-bold text-red-700 font-mono">Chặng {activeIdx + 1} / {journeyData.length}</span>
                        <span>{currentItem.date}</span>
                      </div>

                      <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug mb-3">
                        {currentItem.title}
                      </h2>

                      {/* Diễn biến sự kiện */}
                      <p className="text-stone-700 text-xs sm:text-[14px] leading-relaxed mb-4 text-justify">
                        {currentItem.desc}
                      </p>

                      {/* Ý nghĩa & Lời dạy (gộp chung 1 khối nhẹ nhàng, không chói) */}
                      <div className="bg-[#faf6ee] p-3.5 rounded-xl border-l-3 border-amber-600 text-xs text-stone-800 leading-relaxed mb-4">
                        <div className="font-sans font-bold text-amber-900 text-[11px] mb-1">
                          Ý nghĩa lịch sử:
                        </div>
                        <p className="italic mb-2">"{currentItem.significance}"</p>
                        {currentItem.quote && (
                          <div className="pt-2 border-t border-amber-200/60 text-stone-700">
                            <span className="font-sans font-bold text-stone-900 not-italic">Lời Người: </span>
                            <span className="italic">"{currentItem.quote}"</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Nút chuyển chặng trước / sau */}
                    <div className="flex items-center justify-between pt-4 border-t border-stone-100 font-sans text-xs">
                      <button
                        onClick={handlePrev}
                        disabled={activeIdx === 0}
                        className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                          activeIdx === 0
                            ? 'opacity-30 cursor-not-allowed text-stone-400 bg-stone-100'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer'
                        }`}
                      >
                        <IconChevronLeft className="w-3.5 h-3.5" />
                        <span>Chặng trước</span>
                      </button>

                      <span className="text-stone-400 font-mono text-[11px]">
                        (Phím ← / →)
                      </span>

                      <button
                        onClick={handleNext}
                        disabled={activeIdx === journeyData.length - 1}
                        className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-lg font-semibold transition-all shadow-2xs ${
                          activeIdx === journeyData.length - 1
                            ? 'opacity-30 cursor-not-allowed text-stone-400 bg-stone-100'
                            : 'bg-red-700 hover:bg-red-800 text-white cursor-pointer'
                        }`}
                      >
                        <span>Chặng tiếp theo</span>
                        <IconChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                </div>
              </motion.div>
            </AnimatePresence>

          </div>
        )}

        {/* ===================================================================== */}
        {/* CHẾ ĐỘ 2: TOÀN CẢNH 13 MỐC (DÒNG THỜI GIAN GỌN GÀNG) */}
        {/* ===================================================================== */}
        {viewMode === 'timeline' && (
          <div className="space-y-4 font-sans">
            {journeyData.map((item, index) => (
              <div
                key={item.id}
                className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200/80 shadow-2xs hover:border-red-200 transition-colors"
              >
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-700 text-white font-bold text-[10px] flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="font-bold text-red-700 font-mono">Năm {item.year} ({item.date})</span>
                  </div>
                  <span className="text-stone-500 text-[11px]">{item.location}</span>
                </div>

                <h3 className="font-['Lora',serif] font-bold text-stone-900 text-base mb-1.5">
                  {item.title}
                </h3>

                <p className="font-['Lora',serif] text-stone-700 text-xs leading-relaxed mb-2 text-justify">
                  {item.desc}
                </p>

                <div className="text-xs italic text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200/60">
                  <strong className="font-sans font-bold text-stone-800 not-italic">Ý nghĩa: </strong>
                  "{item.significance}"
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default JourneyMapPage;