import TranslateBox from "@/components/TranslateBox/TranslateBox";
import { PageContainer } from "@ant-design/pro-layout";
import { Card } from "antd";

export default function Book() {
    const text = "This is some text to be translated";
  const translations = ["Translation 1","Translation 2","Translation 3","Translation 4","Translation 5","Translation 6","Translation 7"];
    return (
        <PageContainer>
            <Card>
                <TranslateBox text={text} translations={translations}></TranslateBox>
            </Card>
        </PageContainer>
            )
}
