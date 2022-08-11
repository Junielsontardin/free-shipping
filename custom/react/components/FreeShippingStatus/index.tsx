import React, { useEffect, useState } from "react";
import { OrderForm, OrderFormContext } from "vtex.order-manager";
import styles from "./styles.css";
import { canUseDOM } from "vtex.render-runtime";

interface Props {
    valueForFreeShipping: number,
    region: string,
}
interface FreeShippingStatusProps {
    regionsAndValueToFreeShipping: Props[],
    valueForFreeShipping: number;
    hideForUnlistedRegions: boolean,
    showFreeShippingComponent: boolean,
}

export const FreeShippingStatus = ({
    valueForFreeShipping,
    hideForUnlistedRegions,
    regionsAndValueToFreeShipping,
    showFreeShippingComponent
}:FreeShippingStatusProps)=> {
    if (!canUseDOM) return null;

    const [isFreeShipping, setIsFreeShipping] = useState<boolean>(false);
    const { useOrderForm } = OrderForm;
    const { orderForm }: OrderFormContext = useOrderForm();
    const  state  = orderForm?.shipping?.selectedAddress?.state;

    if (orderForm.totalizers.length >= 2) {
        const { totalizers } = orderForm;
        orderForm.value = totalizers[0].value + totalizers[1].value;
    }

    const { value } = orderForm;

    hideForUnlistedRegions;

    function formatBrazilianCurrency(cents: number): string {
        const config = {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
        };
        const valueFormatter = new Intl.NumberFormat("pt-BR", config).format(cents);
    
        return valueFormatter;
    }

    const exiteFreteEspecificoParaEssaRegiao =
        regionsAndValueToFreeShipping
            .find(({region}) => region === state);

    const valueForFreeShippingSelected =
        (exiteFreteEspecificoParaEssaRegiao)
            ? exiteFreteEspecificoParaEssaRegiao.valueForFreeShipping
            : valueForFreeShipping;

    useEffect(() => {
        if (value >= valueForFreeShippingSelected) {
            setIsFreeShipping(true);
        } else {
            setIsFreeShipping(false);
        }
    }, [value]);

    const dinheiroFaltaParaFreteGratis = valueForFreeShippingSelected - value;
    const dinheiroFaltaParaFreteGratisFormatted = formatBrazilianCurrency(dinheiroFaltaParaFreteGratis /100);

    return (
        <>
            {
                showFreeShippingComponent &&
                <div
                    className={styles.freeShippingStatus__container}
                >
                    {isFreeShipping && (
                        <strong className={styles.freeShippingStatus__gratters}>
                            Parabéns!!!
                        </strong>
                    )}
                    <progress
                        className={styles.freeShippingStatus__progressBar}
                        max={valueForFreeShippingSelected}
                        value={value}
                    />
                    {(isFreeShipping) ? (
                        <p
                            className={styles.freeShippingStatus__text}
                            style={{maxWidth: "152px"}}
                        >
                            Você ganhou o <span className={styles["freeShippingStatus__text--freeShipping"]}> frete grátis </span>
                        </p>
                    ) : (
                        <p className={styles.freeShippingStatus__text}>
                            Com mais <span className={styles["freeShippingStatus__text--value"]}>
                                {dinheiroFaltaParaFreteGratisFormatted}
                            </span> você ganha <span className={styles["freeShippingStatus__text--freeShipping"]}> frete grátis </span>
                        </p>
                    )}
                </div>
            }
        </>
    );
};

FreeShippingStatus.schema = {
    title: "Progresso de Frete Grátis",
};
