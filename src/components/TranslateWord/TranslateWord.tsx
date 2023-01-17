import { Tooltip } from 'antd';
import classNames from 'classnames'

import styles from './TranslateWord.module.less'

interface TranslateWordProps {
    word: string;
    translation: string;
    onClick: (word: string) => void;
}

const TranslateWord: React.FC<TranslateWordProps> = ({ word, translation, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      
        <Tooltip title={translation}>
            <span className={classNames(styles.bubble, isHovered ? styles.bubbleHovered : "")}
                onClick={() => onClick(word)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {word + " "}
                </span>
        </Tooltip>
    );
};

export default TranslateWord;