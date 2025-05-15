import { TweetItem } from "@/components/tweet/tweet-item";
import { TweetPost } from "@/components/tweet/tweet-post";
import { GeneralHeader } from "@/components/ui/general-header";
import { tweet } from "@/data/tweet";

export default function Page() {
    return (
        <div>
            <GeneralHeader backHref="/">
                <div className="font-bold text-lg">Voltar</div>
            </GeneralHeader>
            <div className="border-t-2 border-gray-900">
                <TweetItem tweet={tweet} />

                <div className="border-y-8 border-gray-900">
                    <TweetPost />
                </div>

                <TweetItem tweet={tweet} hideComments />
                <TweetItem tweet={tweet} hideComments />
                <TweetItem tweet={tweet} hideComments />
            </div>
        </div>
    );
}