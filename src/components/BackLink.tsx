import { usePortfolio } from "@/components/PortfolioContext";

type BackLinkProps = {
  className?: string;
  children?: React.ReactNode;
};

export default function BackLink({
  className,
  children = "← Back",
}: BackLinkProps) {
  const { back } = usePortfolio();

  return (
    <button type="button" className={className} onClick={() => back()}>
      {children}
    </button>
  );
}
