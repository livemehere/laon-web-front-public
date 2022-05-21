import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import useInput from "../../hooks/useInput";
import AxiosManager from "../../util/axiosManager";
import { AddressType } from "../../recoil/atoms/addressAtom";
import DaumPostcode from "react-daum-postcode";

interface Props {
  setShow: any;
  address: any;
  setAddress: (value: any) => void;
  user_seq: number;
  setSelectedAdd: any;
  selectedAdd: AddressType | null;
  show: boolean;
}

interface NewAddressType {
  user_seq: number;
  name: string;
  receiver: string;
  address: string;
  phonenumber: string;
  is_default: 0 | 1;
}

interface ModifyAddressType {
  address_seq: number;
  user_seq: number;
  name: string;
  receiver: string;
  address: string;
  phonenumber: string;
  is_default: 0 | 1;
}

const AddressModal: React.FC<Props> = ({
  show,
  setShow,
  address,
  setAddress,
  user_seq,
  setSelectedAdd,
  selectedAdd,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const handleClose = () => {
    setShow(false);
    setSelectedAdd(null);
  };

  const onSubmit: SubmitHandler<any> = (data) => {
    if (selectedAdd) {
      handleModify(data);
    } else {
      handleCreate(data);
    }
  };
  const onError: SubmitErrorHandler<any> = (errors) => console.log(errors);

  useEffect(() => {
    if (selectedAdd) {
      reset(selectedAdd);
    } else {
      reset({});
    }
  }, []);

  const handleCreate: SubmitHandler<any> = async (data) => {
    const finalData: NewAddressType = {
      user_seq: user_seq,
      name: data.name,
      receiver: data.receiver,
      address: data.address,
      phonenumber: data.phonenumber,
      is_default: data.is_default ? 1 : 0,
    };

    const result = await AxiosManager.post("/users/address", finalData);
    // 생성에 성공하면 최신 배송지 목록 받아오기
    if (result.status === 200) {
      const newAddressResult = await AxiosManager.get("/users/address", {
        user_seq,
      });
      if (newAddressResult.status === 200) {
        setAddress(newAddressResult.data.addressBook);
      }
      reset();
      handleClose();
    } else {
      alert("배송지 등록에 실패하였습니다");
    }
  };

  const handleModify: SubmitHandler<any> = async (data) => {
    const finalData: ModifyAddressType = {
      address_seq: selectedAdd?.address_seq!,
      user_seq: user_seq,
      name: data.name,
      receiver: data.receiver,
      address: data.address,
      phonenumber: data.phonenumber,
      is_default: data.is_default ? 1 : 0,
    };

    const result = await AxiosManager.patch("/users/address", finalData);

    if (result.status === 200) {
      const newAddressResult = await AxiosManager.get("/users/address", {
        user_seq,
      });
      if (newAddressResult.status === 200) {
        setAddress(newAddressResult.data.addressBook);
      }
      handleClose();
    }
  };

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setValue("address", fullAddress);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>새 주소록 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit, onError)}>
            <Form.Group className="mb-3">
              <Form.Label>배송지 이름</Form.Label>
              <Form.Control
                type="text"
                placeholder="배송지 이름을 입력해주세요"
                autoFocus
                {...register("name", {
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
              <Form.Label>받는이</Form.Label>
              <Form.Control
                type="text"
                placeholder="받는이 이름을 입력해주세요"
                autoFocus
                {...register("receiver", {
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
            <DaumPostcode onComplete={handleComplete} />
            <Form.Group className="mb-3">
              <Form.Label>주소</Form.Label>
              <Form.Control
                type="text"
                placeholder="위 주소 검색을 통해 선택한 주소가 입력됩니다"
                {...register("address", {
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
              <Form.Label>휴대폰 번호</Form.Label>
              <Form.Control
                type="text"
                placeholder="받는분의 휴대폰번호를 입력해주세요"
                {...register("phonenumber", {
                  required: {
                    value: true,
                    message: "필수 입력값입니다",
                  },
                  pattern: {
                    value: /^[0-9]+$/g,
                    message: "숫자만 입력해주세요",
                  },
                })}
              />
              {errors.phonenumber && (
                <div className={"tw-text-red-400"}>
                  {errors.phonenumber.message}
                </div>
              )}
            </Form.Group>
            <div>
              <label>
                <input type="checkbox" {...register("is_default")} />
                <span className={`tw-text-gray-500 tw-pl-2`}>
                  기본 배송지 등록
                </span>
              </label>
            </div>
            <Modal.Footer className={"tw-mt-5 !tw-p-0"}>
              <button
                className={
                  "tw-bg-primary/95 tw-text-white tw-py-1 tw-px-3 tw-rounded !tw-mt-2 hover:tw-bg-primary"
                }
              >
                {selectedAdd ? "적용" : "추가"}
              </button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddressModal;
