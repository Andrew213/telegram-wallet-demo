import {RegularSpiner} from "@/assets/icons";

type Props = React.SVGProps<SVGSVGElement>;

const Spiner: React.FC<Props> = props => {
  return (
    <div className="inline-block animate-spin rounded-full">
      <RegularSpiner {...props} />
    </div>
  );
};

export default Spiner;
