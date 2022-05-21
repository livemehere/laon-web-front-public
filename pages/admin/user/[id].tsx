import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../../components/common/header";
import Footer from "../../../components/common/footer";
import Layout from "../../../components/common/layout";
import { UserType } from "../../../recoil/atoms/userAtom";
import { useRouter } from "next/router";
import AxiosManager from "../../../util/axiosManager";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { log } from "util";
import dayjs from "dayjs";
import { MessageType } from "../../../components/message/messageContent";
import { PenaltyType } from "../../../components/mypage/mypageCare/mypageCare";
import { MdAddCircleOutline } from "react-icons/md";
import PointTable from "../../../components/mypage/point/pointTable";
import { WithDrawType } from "../../../components/mypage/point/pointContent";

interface Props {}

export interface PointType {
  accrual_seq: number;
  user_seq: number;
  name: string;
  id: string;
  profile_name: string;
  profile_path: string;
  profile_ext: string;
  profile_key: string;
  accrual_point: number;
  accrual_content: string;
  accrual_point_date: string;
  first_register_id: number;
  first_register_date: string;
}

const UserDetail: React.FC<Props> = ({}) => {
  const [user, setUser] = useState<UserType>();
  const [msg, setMsg] = useState<MessageType[]>([]);
  const [pn, setPn] = useState<PenaltyType[]>([]);
  const [activePoint, setActivePoint] = useState(false);
  const [pointList, setPointList] = useState<PointType[]>([]);
  const [requestPointList, setRequestPointList] = useState<WithDrawType[]>([]); //출금내역

  const router = useRouter();
  const id = router.query.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm();

  const getRequestPointList = async (seq: number) => {
    const r = await AxiosManager.get(
      `/users/point/withdrawal/user?user_seq=${seq}`
    );
    console.log("getRequestPointList", r);
    setRequestPointList(r.data.withdrawalRequestList);
  };
  const getMessages = async () => {
    const r = await AxiosManager.get(`/users/message?user_seq=${id}`);
    // 시간순서대로 정렬해서 넣기(최신순)
    setMsg(
      r.data.messageList.receiveList.sort((a: any, b: any) =>
        dayjs(b.first_register_date).diff(a.first_register_date)
      )
    );
  };

  const getPointList = async () => {
    const r = await AxiosManager.get("/users/point/accrual/user", {
      user_seq: id,
    });
    if (r.status === 200) {
      return setPointList(r.data.accrualList);
    } else {
      alert("유저 불러오기 실패");
    }
  };

  const getUser = async () => {
    const r = await AxiosManager.get("users", {
      user_seq: id,
    });
    if (r.status === 200) {
      console.log(r.data.user);
      reset(r.data.user);
      return setUser(r.data.user);
    } else {
      alert("유저 불러오기 실패");
    }
  };

  const getPenalty = async () => {
    const r = await AxiosManager.get(`/users/penalty?user_seq=${id}`);
    setPn(r.data.penalty);
  };

  const handleSaveUserInfo = async () => {
    const values = getValues();
    const result = await AxiosManager.patch("/users", {
      user_seq: values.user_seq,
      name: values.name,
      gender: values.gender,
      birth: values.birth,
      nickname: values.nickname,
      phonenumber: values.phonenumber,
      email: values.email,
      agreement_mms: values.agreement_mms,
      agreement_email: values.agreement_email,
      agreement_info: values.agreement_info,
    });
    if (result.status !== 200) {
      alert("기본정보 저장 실패");
    }
  };

  const handleSaveUserOtherInfo = async () => {
    const values = getValues();
    const result = await AxiosManager.patch("/users/sns", {
      user_seq: values.user_seq,
      blog: values.blog,
      instagram: values.instagram,
      influencer: values.influencer,
      youtube: values.youtube,
    });
    if (result.status === 200) {
      alert("저장되었습니다");
    } else {
      alert("sns 정보 저장 실패");
    }
  };

  const handleSendMessage = async () => {
    const value = getValues().message;
    if (!value) return alert("내용을 입력하세요");
    const r = await AxiosManager.post("/users/message", {
      content: value,
      receiver: id,
      sender: 99,
    });
    if (r.status === 200) {
      alert("전송되었습니다. 내역을보려면 새로고침해주세요.");
    } else {
      alert("전송 중 에러가 발생하였습니다.");
    }
  };

  const handleSendPenalty = async () => {
    const value = getValues().penalty;
    const endDate = getValues().pnDate;
    if (!value || !endDate) return alert("내용과 종료일자를 입력해주세요");

    const r = await AxiosManager.post("/users/penalty", {
      user_seq: id,
      content: value,
      end_date: endDate,
      admin: 99,
    });
    if (r.status === 200) {
      alert("패널티가 등록되었습니다. 내역을보려면 새로고침해주세요.");
    } else {
      alert("전송 중 에러가 발생하였습니다.");
    }
  };

  const handleSave = () => {
    const values = getValues();
    handleSaveUserInfo();
    handleSaveUserOtherInfo();
    //TODO: 추가정보 수정 추가필요
  };

  useEffect(() => {
    if (!id) return;
    getUser();
    getMessages();
    getPenalty();
    getPointList();
    getRequestPointList(Number(id));
  }, [router]);

  const handleAddpointToUser = async () => {
    const value = getValues().addPoint;
    const pointTitle = getValues().pointTitle;
    if (!value || !pointTitle) return alert("금액과 명목은 필수입니다");

    const r = await AxiosManager.post("/users/point/accrual", {
      user_seq: id,
      accrual_point: value,
      accrual_content: pointTitle,
      admin: 99,
    });

    if (r.status === 200) {
      alert("지급이 완료되었습니다");
    } else {
      alert("지급 중 에러가 발생하였습니다");
    }
  };

  return (
    <>
      <Head>
        <title>라온디어스 체험단 | 사용자 정보 수정</title>
        <meta name="description" content="라온디어스 체험단입니다" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Layout className="tw-mb-10">
        <h2 className={"tw-mt-5"}>{getValues().name} 회원님의 정보입니다</h2>
        <div>
          <div className={"tw-w-[150px] tw-m-auto"}>
            <img
              src={getValues().profile_path || "/images/userIcon.png"}
              alt="profile"
              className={"tw-w-[100%] tw-h-[100%]"}
            />
          </div>
        </div>
        <div className={"tw-grid tw-grid-cols-4 tw-gap-x-3 tw-gap-y-8"}>
          <label>
            <span className={"admin-user-span"}>유저 시퀀스</span>
            <input
              type="text"
              disabled
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("user_seq")}
            />
          </label>
          <label>
            <span className={"admin-user-span"}>이름</span>
            <input
              type="text"
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("name")}
            />
          </label>
          <label>
            <span className={"admin-user-span"}>
              성별{" "}
              <span className={"tw-text-sm tw-font-normal tw-text-black/50"}>
                M:남자, F:여자
              </span>
            </span>
            <input
              type="text"
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("gender")}
            />
          </label>
          <label>
            <span className={"admin-user-span"}>닉네임</span>
            <input
              type="text"
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("nickname")}
            />
          </label>
          <label>
            <span className={"admin-user-span"}>아이디</span>
            <input
              type="text"
              disabled
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("id")}
            />
          </label>
          <label>
            <span className={"admin-user-span"}>email</span>
            <input
              type="text"
              disabled
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("email")}
            />
          </label>
          <label>
            <span className={"admin-user-span"}>출생년도</span>
            <input
              type="text"
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("birth")}
            />
          </label>
          <label>
            <span className={"admin-user-span"}>전화번호</span>
            <input
              type="text"
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("phonenumber")}
            />
          </label>
          <label>
            <span className={"admin-user-span tw-flex tw-items-center"}>
              포인트
              <MdAddCircleOutline
                size={20}
                className={
                  "hover:tw-scale-125 tw-cursor-pointer tw-transition-all tw-w-[30px] tw-text-red-500"
                }
                onClick={() => setActivePoint((prev) => !prev)}
              />
            </span>
            <input
              type="number"
              disabled
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("point")}
            />
            {activePoint && (
              <>
                <div className={"tw-flex"}>
                  <input
                    type="number"
                    className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300 tw-flex-[2]"
                    {...register("addPoint")}
                  />
                  <button
                    className="laon-btn tw-flex-[1]"
                    onClick={handleAddpointToUser}
                  >
                    추가
                  </button>
                </div>
                <input
                  type="text"
                  placeholder={"포인트 명목을 입력해주세요"}
                  className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300 tw-flex-[2]"
                  {...register("pointTitle")}
                />
              </>
            )}
          </label>
          <label>
            <span className={"admin-user-span"}>누적 포인트</span>
            <input
              type="text"
              disabled
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("accumulated_point")}
            />
          </label>
          <label>
            <span className={"admin-user-span"}>등급</span>
            <input
              type="text"
              disabled
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("grade")}
            />
          </label>
          <label>
            <span className={"admin-user-span"}>프리미엄 여부</span>
            <input
              type="text"
              disabled
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("is_premium")}
            />
          </label>
          <label>
            <span className={"admin-user-span"}>
              광고주 여부{" "}
              <span className={"tw-text-sm tw-font-normal tw-text-black/50"}>
                0:일반, 1:광고주
              </span>
            </span>
            <input
              type="text"
              disabled
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("is_advertiser")}
            />
          </label>
          <label>
            <span className={"admin-user-span"}>블로그 URL</span>
            <input
              type="text"
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("blog")}
            />
          </label>
          <label>
            <span className={"admin-user-span"}>인플루언서 URL</span>
            <input
              type="text"
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("influencer")}
            />
          </label>
          <label>
            <span className={"admin-user-span"}>인스타그램 URL</span>
            <input
              type="text"
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("instagram")}
            />
          </label>
          <label>
            <span className={"admin-user-span"}>유튜브 URL</span>
            <input
              type="text"
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("youtube")}
            />
          </label>
          <label>
            <span className={"admin-user-span"}>가입 일자</span>
            <input
              type="text"
              disabled
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("first_register_date")}
            />
          </label>
          <div className={"tw-flex tw-gap-1 tw-col-span-2 tw-items-center"}>
            <span className={"admin-user-span"}>동의항목</span>
            <label>
              <input
                type="checkbox"
                className={"tw-mr-2"}
                {...register("agreement_email")}
              />
              <span className={""}>이메일 수신 동의</span>
            </label>
            <label>
              <input
                type="checkbox"
                className={"tw-mr-2"}
                {...register("agreement_mms")}
              />
              <span className={""}>문자 수신 동의</span>
            </label>
            <label>
              <input
                type="checkbox"
                disabled
                className={"tw-mr-2"}
                {...register("agreement_info")}
              />
              <span className={""}>개인정보 제공 동의</span>
            </label>
          </div>
          <label>
            <span className={"admin-user-span"}>신발 사이즈</span>
            <input
              type="text"
              disabled
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("shoe_size")}
            />
          </label>
          <label>
            <span className={"admin-user-span"}>상의 사이즈</span>
            <input
              type="text"
              disabled
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("tops_size")}
            />
          </label>
          <label>
            <span className={"admin-user-span"}>하의 사이즈</span>
            <input
              type="text"
              disabled
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("bottoms_size")}
            />
          </label>
          <label>
            <span className={"admin-user-span"}>피부 타입</span>
            <input
              type="text"
              disabled
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("skin_type")}
            />
          </label>
          <label>
            <span className={"admin-user-span"}>키</span>
            <input
              type="text"
              disabled
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("height")}
            />
          </label>
          <label>
            <span className={"admin-user-span"}>직업</span>
            <input
              type="text"
              disabled
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("job")}
            />
          </label>
          <div className={"tw-flex tw-justify-around tw-items-center"}>
            <span className={"admin-user-span"}>결혼</span>
            <label className={"tw-flex tw-items-center tw-gap-1"}>
              <input
                type="checkbox"
                disabled
                checked={getValues("having_child") === 1}
              />
              <span className={"admin-user-span"}>자식 여부</span>
            </label>
            <label className={"tw-flex tw-items-center tw-gap-1"}>
              <input
                type="checkbox"
                disabled
                checked={getValues("marital_status") === 1}
              />
              <span className={"admin-user-span"}>결혼 여부</span>
            </label>
          </div>
          <label>
            <span className={"admin-user-span"}>반려 동물</span>
            <input
              type="text"
              disabled
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              {...register("companion_animal")}
            />
          </label>
          <div className={"tw-col-span-4"}>
            <button className={"laon-btn"} onClick={handleSave}>
              저장하기
            </button>
          </div>
          <div className={"tw-col-span-2"}>
            <h2>메세지 목록</h2>
            <div className={"tw-flex"}>
              <input
                type="text"
                placeholder={"전송할 메세지를 입력해주세요"}
                className={"laon-input tw-flex-[2]"}
                {...register("message")}
              />
              <button
                className={"laon-btn tw-flex-[.5]"}
                onClick={handleSendMessage}
              >
                전송
              </button>
            </div>
            <ul className={"tw-h-[500px] tw-overflow-scroll"}>
              {msg.map((m) => (
                <li key={m.message_seq} className={"tw-flex tw-gap-1"}>
                  <div>{m.message_seq}</div>
                  {m.is_read === 1 && (
                    <div className={"tw-text-blue-500"}>[읽음]</div>
                  )}
                  <div>{m.content}</div>
                  <div className={"tw-text-sm tw-text-black/50"}>
                    <span>
                      {dayjs(m.first_register_date).format("YYYY-MM-DD hh:mm")}
                    </span>
                    <span>보냄</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className={"tw-col-span-2"}>
            <h2>패널티 목록</h2>
            <div className={"tw-flex"}>
              <input
                type="text"
                placeholder={"등록 할 패널티 입력해주세요"}
                className={"laon-input tw-flex-[2]"}
                {...register("penalty")}
              />
              <button
                className={"laon-btn tw-flex-[.5]"}
                onClick={handleSendPenalty}
              >
                등록
              </button>
            </div>
            <div>
              <input
                type="date"
                className={"laon-input"}
                {...register("pnDate")}
              />
            </div>
            <ul className={"tw-h-[458px] tw-overflow-scroll"}>
              {pn.map((p) => (
                <li key={p.penalty_seq} className={"tw-flex tw-gap-1"}>
                  <div className={"tw-text-black/50"}>{p.penalty_seq}</div>
                  <div>{p.content}</div>
                  <div
                    className={
                      "tw-text-sm tw-text-black/50 tw-flex tw-items-center"
                    }
                  >
                    <span className={""}>
                      {dayjs(p.first_register_date).format("YYYY-MM-DD")} ~{" "}
                      {dayjs(p.end_date).format("YYYY-MM-DD")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className={"tw-col-span-2"}>
            <h2>포인트 적립 내역</h2>
            <ul className={"tw-h-[458px] tw-overflow-scroll tw-p-0 "}>
              <div className={"tw-flex tw-justify-between tw-font-bold"}>
                <span>포인트</span>
                <span>내용</span>
                <span>지급일자</span>
              </div>
              {pointList.map((p) => (
                <li
                  key={p.accrual_seq}
                  className={"tw-flex tw-gap-1 tw-justify-between tw-mb-2"}
                >
                  <div>{p.accrual_point} P</div>
                  <div className={"tw-text-black/50 "}>{p.accrual_content}</div>
                  <div
                    className={
                      "tw-text-sm tw-text-black/50 tw-flex tw-items-center"
                    }
                  >
                    <span className={""}>
                      {dayjs(p.first_register_date).format("YYYY-MM-DD")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className={"tw-col-span-2"}>
            <h2>출금 내역</h2>
            <PointTable type={"출금"} data={requestPointList} />
          </div>
        </div>
      </Layout>
      <Footer />
    </>
  );
};

export default UserDetail;
