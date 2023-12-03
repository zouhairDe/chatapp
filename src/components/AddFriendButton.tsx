"use client";

import { FC, useState } from "react";
import Button from "./ui/Button";
import { addFrienValidator } from "@/lib/validations/add-friend";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface addFriendButtonProps {}

type FormData = z.infer<typeof addFrienValidator>;

const AddFriendButton: FC<addFriendButtonProps> = ({}) => {
  const [showSuccessState, setShowSuccessState] = useState(false);
  const { register, handleSubmit, setError, formState: {errors} } = useForm<FormData>({
    resolver: zodResolver(addFrienValidator),
  });
  const addFriend = async (email: string) => {
    try {
      const validatedEnail = addFrienValidator.parse({ email });
      await axios.post("/api/friends/add", {
        email: validatedEnail,
      });
      setShowSuccessState(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError('email', {message: error.message})
        return
      }

      if (error instanceof AxiosError) {
        setError('email', {message: error.response?.data})
        return
      }

      setError('email', {message: 'Something went wrong!'})
    }
  };

  const onSubmit = (data: FormData) => {
    addFriend(data.email)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <label htmlFor="email" className="block text-sm font-medium">
        Add Friend By Email
      </label>
      <div className="gap-4 flex mt-2">
        <input
          {...register('email')}
          type="text"
          className="rounded-md block w-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="xyz@example.com"
        />
        <Button>Send Request</Button>
      </div>
      <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
      {showSuccessState ? (
        <p className="mt-1 text-sm text-green-600">Friend request has been sent Successfully</p>
      ) : null}
    </form>
  );
};

export default AddFriendButton;
