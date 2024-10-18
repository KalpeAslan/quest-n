import { BigNumberish } from "@ethersproject/bignumber";
import { DateTime } from "luxon";

import { IGroupedProjects, IProjects } from "@models";
import { LocalStorageService } from "./LocalStorageService";
import { Chain } from "wagmi";

export class HelperService {
  public static WALLET_CONNECTION_KEY = "isConnected";

  public static addNumberSeparator(
    data: number | string | null,
    maximumFractionDigits = 6,
  ): string | null {
    if (data == null) {
      return null;
    }

    const n = typeof data === "string" ? parseFloat(data) : data;

    return n.toLocaleString("en-US", { maximumFractionDigits });
  }

  public static roundDown(
    data: number | string | null,
    maximumFractionDigits = 2,
  ): number | null {
    if (data == null) {
      return null;
    }

    const n = typeof data === "string" ? parseFloat(data) : data;
    const index = Math.pow(10, maximumFractionDigits);

    return Math.floor(n * index) / index;
  }

  public static parseMd(text: string) {
    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  }

  public static sortProjects(projects: IGroupedProjects): IGroupedProjects {
    const { liveProjects, previousProjects, upcomingProjects } = projects;

    liveProjects.sort(
      (a, b) =>
        DateTime.fromISO(b.projectStartAt).toUnixInteger() -
        DateTime.fromISO(a.projectStartAt).toUnixInteger(),
    );
    upcomingProjects.sort((a, b) => {
      if (a.projectStartAt && b.projectStartAt) {
        return (
          DateTime.fromISO(a.projectStartAt).toUnixInteger() -
          DateTime.fromISO(b.projectStartAt).toUnixInteger()
        );
      }

      return 1;
    });

    previousProjects.sort(
      (a, b) =>
        DateTime.fromISO(b.projectStartAt).toUnixInteger() -
        DateTime.fromISO(a.projectStartAt).toUnixInteger(),
    );

    return {
      liveProjects,
      previousProjects,
      upcomingProjects,
    };
  }

  public static groupProjects(
    allProjects: IProjects[],
    networks: Chain[],
  ): IGroupedProjects {
    const liveProjects: IProjects[] = [];
    const previousProjects: IProjects[] = [];
    const upcomingProjects: IProjects[] = [];

    allProjects.forEach(p => {
      p.network = {
        networkName: p.network,
      };

      if (p.status === "Sale" || p.status === "Live") {
        liveProjects.push(p as any);
      }

      if (p.status !== "Ended" && p.status !== "Sale") {
        upcomingProjects.push(p as any);
      }

      if (p.status === "Ended") {
        previousProjects.push(p as any);
      }
    });

    return {
      liveProjects,
      previousProjects,
      upcomingProjects,
    };
  }

  public static setIntervalTimer(time: number, cb: any) {
    const intervalId = setInterval(() => cb(), time || 0);

    return intervalId;
  }

  public static clearIntervalTimer(intervalId: ReturnType<typeof setInterval>) {
    if (intervalId) {
      clearInterval(intervalId);
    }
  }

  public static hex_to_ascii(str: string): string {
    const hex = str.toString();
    let text = "";

    for (let n = 0; n < hex.length; n += 2) {
      text += String.fromCharCode(parseInt(hex.substring(n, 2), 16));
    }

    return text;
  }

  public static getShortAddress(address: string, cutPart: number): string {
    return `${address.substring(0, cutPart)}...${address.substring(
      address.length - 4,
    )}`;
  }

  public static toNumber(bigNumber: BigNumberish): number {
    return parseFloat(bigNumber.toString());
  }

  public static ifInclude(array: string[], string: string): boolean {
    try {
      array.forEach(item => {
        const include = string.includes(item);

        if (include) {
          throw true;
        }
      });

      return false;
    } catch (val) {
      return true;
    }
  }

  public static getTextWidth(text: string) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (context) {
      context.font = "normal 14px serif";

      return context.measureText(text).width;
    }

    return null;
  }

  public static setupAuthData(res: {
    accessToken: string;
    refreshToken: string;
  }) {
    LocalStorageService.setItem("au-t", res.accessToken);
    LocalStorageService.setItem("au-rt", res.refreshToken);
  }
}
