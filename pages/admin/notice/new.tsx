import React, { useEffect } from "react";
import Head from "next/head";
import Header from "../../../components/common/header";
import Footer from "../../../components/common/footer";
import Layout from "../../../components/common/layout";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import AxiosManager from "../../../util/axiosManager";
import { useRouter } from "next/router";

interface Props {}

const NoticeWrite: React.FC<Props> = ({}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const onSubmit: SubmitHandler<any> = async (data) => {
    const r = await AxiosManager.post("/notice", {
      user_seq: 99,
      title: data.title,
      content: data.content,
    });
    if (r.status === 200) {
      alert("작성되었습니다.");
      router.back();
    } else {
      alert("작성 중 오류가 발생하였습니다.");
    }
  };
  const onError: SubmitErrorHandler<any> = (errors) => console.log(errors);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <>
      <Head>
        <title>라온디어스 체험단 | 공지사항 작성</title>
        <meta name="description" content="라온디어스 체험단입니다" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <Header />
        <Layout>
          <h2 className={"tw-mt-10"}>
            공지사항 작성{" "}
            <span className={"tw-text-sm tw-text-black/50"}>
              * 삭제는 공지사항 상세페이지에서 가능합니다
            </span>
          </h2>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <input
              type="text"
              placeholder="제목"
              {...register("title", {
                required: {
                  value: true,
                  message: "필수 입력값입니다",
                },
              })}
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300 tw-mb-2"
            />
            <textarea
              {...register("content", {
                required: {
                  value: true,
                  message: "필수 입력값입니다",
                },
              })}
              placeholder={"내용을 작성해주세요"}
              className={
                "tw-w-[100%] tw-border-black/20 tw-border-[1px] tw-min-h-[20rem] tw-mb-2 tw-p-2"
              }
            />
            <button
              className={"tw-bg-primary tw-w-[100%] tw-py-2 tw-text-white"}
            >
              작성
            </button>
          </form>
        </Layout>
        <Footer />
      </>
    </>
  );
};

export default NoticeWrite;
