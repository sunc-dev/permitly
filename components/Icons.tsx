import React from "react";
import {
  SparkleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  BellIcon,
  XIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ChatCircleIcon,
  ChatTeardropTextIcon,
  CheckIcon,
  CheckCircleIcon,
  BuildingsIcon,
  StorefrontIcon,
  TicketIcon,
  ClockIcon,
  WarningCircleIcon,
  DotsThreeIcon,
  PaperclipIcon,
  ImageIcon as PhImageIcon,
  DownloadSimpleIcon,
  FunnelSimpleIcon,
  ArrowsDownUpIcon,
  UploadSimpleIcon,
  CreditCardIcon,
  CaretDownIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";

// Shared icon layer — backed by Phosphor. Component names + prop shapes are kept
// stable so call sites stay simple. Everything visual routes through here.

export const Sparkle = ({ size = 10, fill = "white" }: { size?: number; fill?: string }) => (
  <SparkleIcon size={size} color={fill} weight="fill" />
);

export const Plus = ({ size = 11, stroke = "#1D4ED8" }: { size?: number; stroke?: string; width?: number }) => (
  <PlusIcon size={size} color={stroke} weight="bold" />
);

export const Search = ({ size = 15 }: { size?: number }) => <MagnifyingGlassIcon size={size} color="currentColor" />;

export const Bell = () => <BellIcon size={16} color="currentColor" />;

export const Close = ({ size = 12 }: { size?: number }) => <XIcon size={size} color="currentColor" weight="bold" />;

export const ArrowLeft = ({ size = 15 }: { size?: number }) => <ArrowLeftIcon size={size} color="currentColor" weight="bold" />;

export const ArrowRight = ({ size = 12, stroke = "#1D4ED8" }: { size?: number; stroke?: string; width?: number }) => (
  <ArrowRightIcon size={size} color={stroke} weight="bold" />
);

export const Send = ({ size = 12 }: { size?: number }) => <ArrowUpIcon size={size} color="white" weight="bold" />;

export const Comment = ({ size = 15 }: { size?: number }) => <ChatTeardropTextIcon size={size} color="currentColor" />;

export const ChatBubble = ({ size = 13, stroke = "var(--fg-3)" }: { size?: number; stroke?: string }) => (
  <ChatCircleIcon size={size} color={stroke} />
);

export const Check = ({ size = 8, stroke = "white" }: { size?: number; stroke?: string; width?: number }) => (
  <CheckIcon size={size} color={stroke} weight="bold" />
);

export const CheckCircle = ({ size = 16, stroke = "#1D4ED8" }: { size?: number; stroke?: string }) => (
  <CheckCircleIcon size={size} color={stroke} weight="regular" />
);

export const Building = ({ stroke = "var(--brand)", size = 14 }: { stroke?: string; size?: number }) => <BuildingsIcon size={size} color={stroke} />;

export const Business = ({ stroke = "var(--green)", size = 14 }: { stroke?: string; size?: number }) => <StorefrontIcon size={size} color={stroke} />;

export const Clock = ({ stroke = "var(--amber)", size = 14 }: { stroke?: string; size?: number }) => <TicketIcon size={size} color={stroke} />;

export const ClockCircle = ({ stroke = "#1D4ED8", size = 16 }: { stroke?: string; size?: number }) => <ClockIcon size={size} color={stroke} />;

export const Warn = ({ stroke = "#B45309", size = 13 }: { stroke?: string; size?: number }) => <WarningCircleIcon size={size} color={stroke} />;

export const Dots = ({ size = 15, stroke = "currentColor" }: { size?: number; stroke?: string }) => <DotsThreeIcon size={size} color={stroke} weight="bold" />;

export const Paperclip = ({ size = 14 }: { size?: number }) => <PaperclipIcon size={size} color="currentColor" />;

export const ImageIcon = ({ size = 14 }: { size?: number }) => <PhImageIcon size={size} color="currentColor" />;

export const Download = ({ size = 12, stroke = "#1D4ED8" }: { size?: number; stroke?: string }) => <DownloadSimpleIcon size={size} color={stroke} />;

export const Funnel = ({ size = 15, stroke = "currentColor" }: { size?: number; stroke?: string }) => <FunnelSimpleIcon size={size} color={stroke} />;

export const Sort = ({ size = 15, stroke = "currentColor" }: { size?: number; stroke?: string }) => <ArrowsDownUpIcon size={size} color={stroke} />;

export const Upload = ({ size = 22, stroke = "var(--fg-3)" }: { size?: number; stroke?: string }) => <UploadSimpleIcon size={size} color={stroke} />;

export const CreditCard = ({ size = 11, stroke = "#1D4ED8" }: { size?: number; stroke?: string }) => <CreditCardIcon size={size} color={stroke} />;

export const Caret = ({ size = 16, stroke = "var(--fg-3)" }: { size?: number; stroke?: string }) => <CaretDownIcon size={size} color={stroke} weight="bold" />;

export const CaretRight = ({ size = 16, stroke = "white" }: { size?: number; stroke?: string }) => <CaretRightIcon size={size} color={stroke} weight="bold" />;
