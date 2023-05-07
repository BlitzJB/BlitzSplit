import React from "react";
import { type NextPage } from "next";
import { api } from "~/utils/api";
import { TextField } from "~/blitzforms/v1";
import { useRouter } from "next/router";

const Complete: NextPage = () => {

    const [upiId, setUpiId] = React.useState<string>("");
    const updateUPIIdMutation = api.users.updateUPIId.useMutation();
    const router = useRouter();
    const { redirect } = router.query;

    return (<>
        <TextField value={upiId} setValue={setUpiId} label="UPI ID" />
        <button
            onClick={e => {
                updateUPIIdMutation.mutate(
                    { upiId },
                    {
                        onSuccess(data, variables, context) {
                            if (!redirect) {
                                router.push("/");
                            } else {
                                router.push(redirect as string);
                            }
                        },
                        onError(error, variables, context) {
                            console.log(error);
                            alert("Something went wrong! panic!");
                        }
                    }
                );
            }}
            className="py-2 px-4 bg-green-500 text-white rounded-md"
        >
            {
                updateUPIIdMutation.isLoading
                    ? "Getting you setup!"
                    : "Finish"
            }
        </button>
    </>)
}

export default Complete;