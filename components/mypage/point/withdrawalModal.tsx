import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import DaumPostcode from "react-daum-postcode";
import AxiosManager from "../../../util/axiosManager";

interface Props {
  setShow: any;
  user_seq: number;
  show: boolean;
  name: string;
}

const WithdrawalMoal: React.FC<Props> = ({ show, setShow, user_seq, name }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    setValue("withdrawal_name", name);
  }, [name]);

  const handleClose = () => {
    setShow(false);
  };

  const onSubmit: SubmitHandler<any> = async (data) => {
    if (data.withdrawal_point < 10000)
      return alert("10,000 P 이상부터 출금신청이 가능합니다.");

    const r = await AxiosManager.post("/users/point/withdrawal", {
      user_seq: user_seq,
      withdrawal_point: data.withdrawal_point,
      withdrawal_account: data.withdrawal_account,
      withdrawal_name: name,
      withdrawal_bank: data.withdrawal_bank,
    });
    if (r.status === 200) {
      alert("출금신청 완료!");
      window.location.reload();
    } else {
      alert("출금 신청 실패");
    }
  };

  const onError: SubmitErrorHandler<any> = (errors) => console.log(errors);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>출금 신청</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit, onError)}>
            <Form.Group className="mb-3">
              <Form.Label>
                계좌명의{" "}
                <span className="tw-text-sm tw-text-red-500">
                  * 본인 명의만 가능합니다
                </span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="계좌 소유주 이름"
                disabled
                {...register("withdrawal_name", {
                  required: {
                    value: true,
                    message: "필수 입력값입니다",
                  },
                })}
              />
              {errors.name && (
                <div className={"tw-text-red-400"}>{errors.name.message}</div>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>은행명</Form.Label>
              <Form.Control
                type="text"
                placeholder="ex) 국민은행,농협은행"
                autoFocus
                {...register("withdrawal_bank", {
                  required: {
                    value: true,
                    message: "필수 입력값입니다",
                  },
                })}
              />
              {errors.receiver && (
                <div className={"tw-text-red-400"}>
                  {errors.receiver.message}
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>계좌번호</Form.Label>
              <Form.Control
                type="number"
                placeholder="번호만 입력해주세요"
                {...register("withdrawal_account", {
                  required: {
                    value: true,
                    message: "필수 입력값입니다",
                  },
                })}
              />
              {errors.address && (
                <div className={"tw-text-red-400"}>
                  {errors.address.message}
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>포인트</Form.Label>
              <Form.Control
                type="number"
                placeholder="출금할 금액을 입력해주세요"
                {...register("withdrawal_point", {
                  required: {
                    value: true,
                    message: "필수 입력값입니다",
                  },
                })}
              />
              {errors.phonenumber && (
                <div className={"tw-text-red-400"}>
                  {errors.phonenumber.message}
                </div>
              )}
            </Form.Group>
            <Modal.Footer className={"tw-mt-5 !tw-p-0"}>
              <button
                className={
                  "tw-bg-primary/95 tw-text-white tw-py-1 tw-px-3 tw-rounded !tw-mt-2 hover:tw-bg-primary"
                }
              >
                신청
              </button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WithdrawalMoal;
