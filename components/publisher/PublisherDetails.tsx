"use client";

import { Button } from "@/components/ui/button";
import PublisherDialog from "@/components/navigation/PublisherDialog";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Moment from "react-moment";

const PublisherDetails = ({
  publisher,
  noOfBooks,
}: {
  publisher: publisher;
  noOfBooks: number;
}) => {
  const session = useSession();
  const [open, setOpen] = useState(false);

  const isPublisher = session.data?.user?.id === publisher.userId;
  return (
    <>
      <PublisherDialog open={open} setOpen={setOpen} publisher={publisher} />
      <div className="p-4 h-fit border-gradient rounded-md">
        <div className="flex flex-col space-y-4 justify-center items-center">
          {/* <h1 className="text-2xl font-bold mb-4 text-primary">
            {publisher.name} Profile
          </h1> */}
          <img
            src={publisher.image || ""}
            alt=""
            className="size-48 rounded-lg"
          />
          <p className="text-2xl font-bold">{publisher.name}</p>
          <p className="text-xl font-semibold">Published Books: {noOfBooks}</p>
          <p>
            Created:{"  "}
            {publisher.createdAt && (
              <Moment fromNow>{publisher.createdAt}</Moment>
            )}
          </p>
          <p className="text-center">{publisher.description}</p>
          {isPublisher && (
            <Button className="w-full" onClick={() => setOpen(true)}>
              Update Profile
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default PublisherDetails;
