import React, { useState } from "react";
import { Form, Button, Table, Spinner } from "react-bootstrap";
import axios from "axios";
import "./App.css"; // Import the CSS file
import { Analytics } from "@vercel/analytics/react";
import logoBK from '../src/images/logoBK.png'
export const App = () => {
    const [number, setNumber] = useState("");
    const [result, setResult] = useState(null);
    const [resultKhoi, setResultKhoi] = useState(null);
    const [khoi, setKhoi] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // New state for handling errors
    const [errorRank, setErrorRank] = useState(null); // New state for handling errors
    const options = [
        { value: "A", label: "A" },
        { value: "B", label: "B" },
        { value: "C", label: "C" },
        { value: "D", label: "D1" },
        { value: "A1", label: "A1" },
        { value: "D7", label: "D7" },
        { value: "A_TOAN", label: "A00 (Toán x2)" },
        { value: "A1_TOAN", label: "A01 (Toán x2)" },
        { value: "D_TIENG_ANH", label: "D1 (Tiếng Anh x2)" },
        // Add more options here as needed
    ];

    const provinceCodes = {
        1: "Hà Nội",
        2: "TP. Hồ Chí Minh",
        3: "Hải Phòng",
        4: "Đà Nẵng",
        5: "Hà Giang",
        6: "Cao Bằng",
        7: "Lai Châu",
        8: "Lào Cai",
        9: "Tuyên Quang",
        10: "Lạng Sơn",
        11: "Bắc Kạn",
        12: "Thái Nguyên",
        13: "Yên Bái",
        14: "Sơn La",
        15: "Phú Thọ",
        16: "Vĩnh Phúc",
        17: "Quảng Ninh",
        18: "Bắc Giang",
        19: "Bắc Ninh",
        21: "Hải Dương",
        22: "Hưng Yên",
        23: "Hoà Bình",
        24: "Hà Nam",
        25: "Nam Định",
        26: "Thái Bình",
        27: "Ninh Bình",
        28: "Thanh Hoá",
        29: "Nghệ An",
        30: "Hà Tĩnh",
        31: "Quảng Bình",
        32: "Quảng Trị",
        33: "Thừa Thiên Huế",
        34: "Quảng Nam",
        35: "Quảng Ngãi",
        36: "Kon Tum",
        37: "Bình Định",
        38: "Gia Lai",
        39: "Phú Yên",
        40: "Đắk Lắk",
        41: "Khánh Hoà",
        42: "Lâm Đồng",
        43: "Bình Phước",
        44: "Bình Dương",
        45: "Ninh Thuận",
        46: "Tây Ninh",
        47: "Bình Thuận",
        48: "Đồng Nai",
        49: "Long An",
        50: "Đồng Tháp",
        51: "An Giang",
        52: "Bà Rịa-Vũng Tàu",
        53: "Tiền Giang",
        54: "Kiên Giang",
        55: "Cần Thơ",
        56: "Bến Tre",
        57: "Vĩnh Long",
        58: "Trà Vinh",
        59: "Sóc Trăng",
        60: "Bạc Liêu",
        61: "Cà Mau",
        62: "Điện Biên",
        64: "Hậu Giang",
    };
    const fields = [
        { label: 'SBD', value: 'sbd' },
        { label: 'Toán', value: 'toan' },
        { label: 'Ngữ Văn', value: 'ngu_van' },
        { label: 'Ngoại Ngữ', value: 'ngoai_ngu' },
        { label: 'Vật lí', value: 'vat_li' },
        { label: 'Hoá học', value: 'hoa_hoc' },
        { label: 'Sinh học', value: 'sinh_hoc' },
        { label: 'Lịch sử', value: 'lich_su' },
        { label: 'Địa lí', value: 'dia_li' },
        { label: 'GDCD', value: 'gdcd' },
        // Add more fields here as needed
    ];
    function checkArea(sbd) {
        // Make sure sbd is a string
        let sbd_trim = sbd.toString().trim();
        if (sbd_trim.length === 7) {
            sbd_trim = "0" + sbd_trim;
        }
        // Extract the first two characters (province code)
        const code = parseInt(sbd_trim.substring(0, 2));
        if (code === 1 || (code > 2 && code <= 31)) {
            return "Bắc";
        } else {
            return "Nam";
        }
    }

    function checkProvince(sbd) {
        // Make sure sbd is a string
        let sbd_trim = sbd.toString().trim();
        if (sbd_trim.length === 7) {
            sbd_trim = "0" + sbd_trim;
        }
        // Extract the first two characters (province code)
        const code = sbd_trim.substring(0, 2);
        return provinceCodes[parseInt(code)];
    }

    const getScore = async () => {
        setLoading(true); // Show the spinner when the API call starts
        setResult(null);
        let config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `https://api.xephangdiemthi.edu.vn/api/v1/score/sbd=${number}`,
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            const response = await axios.request(config);
            setResult(response.data.data);
            console.log(response.data.data);
            setError(null);
        } catch (error) {
            setError("Số báo danh không tồn tại");
            setResultKhoi(null); // Clear the result in case of an error
        } finally {
            // Set loading back to false after the response is received (success or error)
            setLoading(false);
        }
    };
    const rankKhoi = async () => {
        setLoading(true); // Show the spinner when the API call starts
        let config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `https://api.xephangdiemthi.edu.vn/api/v1/khoi/khoi=${khoi}/sbd=${number}`,
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            const response = await axios.request(config);
            setResultKhoi(response.data.data);
            console.log(response.data.data);
        } catch (error) {
            setResultKhoi(null); // Clear the result in case of an error
            console.log(error);
        } finally {
            // Set loading back to false after the response is received (success or error)
            setLoading(false);
            setError(null);
        }
    };

    const onClickHandler = async () => {
        if (number.length >= 7 && number.length <= 8) {
            await getScore();
            setResultKhoi(null);
        } else {
            setError("Hãy nhập một số báo danh hợp lệ");
            setResult(null);
        }
    };
    const checkDiem = (a, b, c) => {
        return a > 1 && b > 1 && c > 1;
    };
    const checkValid = () => {
        if (khoi === "A" || khoi === "A_TOAN")
            return checkDiem(result.toan, result.vat_li, result.hoa_hoc);
        if (khoi === "B")
            return checkDiem(result.toan, result.sinh_hoc, result.hoa_hoc);
        if (khoi === "C")
            return checkDiem(result.ngu_van, result.lich_su, result.dia_li);
        if (khoi === "D" || khoi === "D_TIENG_ANH")
            return checkDiem(result.toan, result.ngoai_ngu, result.ngoai_ngu);
        if (khoi === "A1" || khoi === "A1_TOAN")
            return checkDiem(result.toan, result.vat_li, result.ngoai_ngu);
        if (khoi === "D7")
            return checkDiem(result.toan, result.ngoai_ngu, result.hoa_hoc);
    };
    const onClickHandlerKhoi = async () => {
        if (checkValid()) {
            await rankKhoi();
            setErrorRank(null);
        } else {
            setErrorRank("Không có khổi xếp hạng bạn chọn");
            setResultKhoi(null);
        }
    };
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        setKhoi(event.target.value);
    };
    const onChangeNumber = (event) => {
        setNumber(event.target.value);
    };
    let isEven = true;

    return (
        <div>
            <header style={{marginTop:'20px', marginBottom:'20px'}}>
                <img className="logo" src={logoBK} alt="header" />
                <p id="text_header">
                    Tra cứu thứ hạng điểm thi THPT Quốc Gia 2024
                </p>
            </header>
            {/* <div id="container_compare">
                <a
                    id="compare_score"
                    href="https://drive.google.com/drive/folders/1JD21Bxtk5wG4hysbGuYRUtO-qFyVfGbV?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                >
                    So sánh điểm từng khối của từng tỉnh và cả nước
                </a>
            </div> */}
            {/* <h3 id="noti" style={{ color: "red" }}>
  Bọn mình đang hoàn thiện chức năng website, bạn hãy quay lại sau nhé ^^
</h3> */}

            <Form class="enter_sbd">
                <Form.Group controlId="formId">
                    <Form.Label
                        style={{
                            fontWeight: "bold",
                            marginBottom: "10px",
                            marginTop: "15px",
                        }}
                    >
                        Nhập số báo danh của bạn
                    </Form.Label>
                    <Form.Control
                        type="text"
                        value={number}
                        onChange={onChangeNumber}
                        style={{ width: "100%", fontSize: "14px", padding:'10px 2px', borderRadius:'5px', marginTop:'10px' }}
                        placeholder="Enter your id"
                    />
                </Form.Group>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "10px",
                    }}
                >
                    <Button
                        id="score_button"
                        variant="primary"
                        onClick={onClickHandler}
                        style={{
                            marginTop: "10px",
                            padding:'10px 30px',
                            borderRadius:'20px',
                        }}
                        className="button-submit"
                    >
                        Gửi
                    </Button>
                    {loading && (
                        <Spinner
                            animation="border"
                            role="status"
                            style={{
                                position: "absolute",
                                marginTop: "17px",
                                marginLeft: "120px",
                                width: "1.5rem",
                                height: "1.5rem",
                                color: "black",
                            }}
                        />
                    )}
                </div>
            </Form>
            {result && (
                <div className="result-table">
                    <h2 id="text_ketqua">
                        Kết quả thi của SBD : {number} <br></br> Sở GDĐT{" "}
                        {checkProvince(number.toString())}
                    </h2>
                    <table style={{ width: '100%' }} striped bordered hover>
                        <tbody>
                            {fields.map(field => {
                                if (result[field.value] != null) {
                                    const backgroundColor = isEven ? '#f0f0f0' : 'white';
                                    isEven = !isEven; // Toggle the value for the next row
                                    return (
                                        <tr key={field.value} style={{ backgroundColor }}>
                                            <td
                                                style={{
                                                    fontWeight: "bold",
                                                    width: "50%",
                                                    padding: '10px'
                                                }}
                                            >
                                                {field.label}:
                                            </td>
                                            <td
                                                style={{
                                                    width: "50%",
                                                    textAlign: "center",
                                                    padding: '10px'
                                                }}
                                            >
                                                {result[field.value]}
                                            </td>
                                        </tr>
                                    );
                                }
                                return null;
                            })}
                        </tbody>
                    </table>

                    <Form id="rank_khoi" style={{width:'100%'}}>
                        <Form.Group controlId="formOptions">
                            <Form.Label
                                style={{
                                    fontWeight: "bold",
                                    marginBottom: "10px",
                                    marginTop: "15px",
                                }}
                            >
                                Xem xếp hạng theo khối:
                            </Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedOption}
                                onChange={handleOptionChange}
                                style={{ width: "100%", fontSize: "14px", padding:'10px', borderRadius:'5px', marginTop:'10px' }}
                                >
                                <option value="">-- Chọn một khối --</option>
                                {options.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "10px",
                                padding:'10px'
                            }}
                        >
                            <Button
                                className="button-submit"
                                variant="primary"
                                onClick={onClickHandlerKhoi}
                                style={{padding:'10px 30px', borderRadius:'20px'}}
                                
                            >
                                Gửi
                            </Button>
                            {loading && (
                                <Spinner
                                    animation="border"
                                    role="status"
                                    style={{
                                        position: "absolute",
                                        marginTop: "6px",
                                        marginLeft: "120px",
                                        width: "1.5rem",
                                        height: "1.5rem",
                                        color: "black",
                                    }}
                                />
                            )}
                        </div>
                    </Form>
                    {errorRank && <p class="result">{errorRank}</p>}
                    <br></br>
                    {resultKhoi && (
                        <div style={{width:'100%'}}>
                            <h4>Xếp hạng theo khối {khoi.toUpperCase()}</h4>

                            <table
                                striped
                                bordered
                                hover
                                style={{ tableLayout: "fixed", width:'100%' }}
                            >
                                <tbody style={{width:'100%'}}>
                                    <tr>
                                        <td
                                            style={{
                                                fontWeight: "bold",
                                                backgroundColor: "#f0f0f0",
                                                width: "50%",
                                                padding:'10px'
                                            }}
                                        >
                                            Tổng điểm:
                                        </td>
                                        <td
                                            style={{
                                                width: "50%",
                                                textAlign: "center",
                                                padding:'10px'
                                            }}
                                        >
                                            {resultKhoi.tong_diem}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            style={{
                                                fontWeight: "bold",
                                                backgroundColor: "#f0f0f0",
                                                width: "50%",
                                                padding:'10px'
                                            }}
                                        >
                                            Toàn quốc:
                                        </td>
                                        <td
                                            style={{
                                                width: "50%",
                                                textAlign: "center",
                                                padding:'10px'
                                            }}
                                        >
                                            {resultKhoi.xep_hang_toan_quoc}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            style={{
                                                fontWeight: "bold",
                                                backgroundColor: "#f0f0f0",
                                                width: "50%",
                                                padding:'10px'
                                            }}
                                        >
                                            Tỉnh/TP:
                                        </td>
                                        <td
                                            style={{
                                                width: "50%",
                                                textAlign: "center",
                                                padding:'10px'
                                            }}
                                        >
                                            {resultKhoi.xep_hang_tinh}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            style={{
                                                fontWeight: "bold",
                                                backgroundColor: "#f0f0f0",
                                                width: "50%",
                                                padding:'10px'
                                            }}
                                        >
                                            Miền {checkArea(number.toString())}:
                                        </td>
                                        <td
                                            style={{
                                                width: "50%",
                                                textAlign: "center",
                                                padding:'10px'
                                            }}
                                        >
                                            {resultKhoi.xep_hang_mien}
                                        </td>
                                    </tr>
                                    {/* Add more fields here as needed */}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
            {error && <p class="result">{error}</p>}
            {/* {!result && <p class="result">Hãy nhập đúng số báo danh</p>} */}
            <br></br>
            <footer>
                <p>
                    Copyright by <span>Phan Hoàng Phúc</span><sup>&copy;</sup> 2024
                </p>
                <p>Bản quyền thuộc Bộ Giáo Dục và Đào Tạo</p>

            </footer>
            <Analytics />
        </div>
    );
};

export default App;